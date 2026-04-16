import { randomUUID } from "crypto";

import { appConfig } from "../../../../packages/shared-config/src";
import type {
  ComplaintRecord,
  CustomerProfile,
  DashboardMetrics,
  DriverProfile,
  PaymentMethod,
  RideCategory,
  RideRecord,
  RideStatus,
  VerificationStatus,
} from "../../../../packages/shared-types/src";

import { NotFoundError } from "../lib/errors";

import { mapComplaint, mapCustomer, mapDriver, mapLandmark, mapRide, mapRideCategory, mapZone } from "./mappers";
import type { Queryable } from "./pool";

export class PlatformRepository {
  constructor(private readonly db: Queryable) {}

  async createOtpRequest(phone: string, role: "customer" | "driver" | "admin", code: string, expiresAt: Date) {
    await this.db.query(
      `insert into otp_requests (id, phone, role, otp_code, expires_at)
       values ($1, $2, $3, $4, $5)`,
      [randomUUID(), phone, role, code, expiresAt]
    );
  }

  async consumeOtpRequest(phone: string, role: "customer" | "driver" | "admin", code: string) {
    const result = await this.db.query(
      `update otp_requests
       set consumed_at = now()
       where id = (
         select id from otp_requests
         where phone = $1 and role = $2 and otp_code = $3 and consumed_at is null and expires_at > now()
         order by created_at desc
         limit 1
       )
       returning id`,
      [phone, role, code]
    );

    return (result.rowCount ?? 0) > 0;
  }

  async findAdminByPhone(phone: string) {
    const result = await this.db.query("select * from admins where phone = $1 limit 1", [phone]);
    return result.rows[0] as { id: string; name: string; phone: string } | undefined;
  }

  async findCustomerByPhone(phone: string) {
    const result = await this.db.query("select * from users where phone = $1 limit 1", [phone]);
    return result.rows[0] ? mapCustomer(result.rows[0]) : undefined;
  }

  async findOrCreateCustomerByPhone(phone: string) {
    const existing = await this.findCustomerByPhone(phone);
    if (existing) {
      return existing;
    }

    const created = await this.db.query(
      `insert into users (id, name, phone, status)
       values ($1, $2, $3, 'active')
       returning *`,
      [randomUUID(), `Customer ${phone.slice(-4)}`, phone]
    );

    return mapCustomer(created.rows[0]);
  }

  async findDriverByPhone(phone: string) {
    const result = await this.db.query("select * from drivers where phone = $1 limit 1", [phone]);
    return result.rows[0] ? mapDriver(result.rows[0]) : undefined;
  }

  async createRefreshToken(userId: string, role: "customer" | "driver" | "admin", tokenId: string, expiresAt: Date) {
    await this.db.query(
      `insert into refresh_tokens (id, user_id, role, expires_at)
       values ($1, $2, $3, $4)`,
      [tokenId, userId, role, expiresAt]
    );
  }

  async getRefreshToken(tokenId: string) {
    const result = await this.db.query("select * from refresh_tokens where id = $1 limit 1", [tokenId]);
    return result.rows[0] as
      | {
          id: string;
          user_id: string;
          role: "customer" | "driver" | "admin";
          expires_at: Date;
          revoked_at: Date | null;
        }
      | undefined;
  }

  async revokeRefreshToken(tokenId: string) {
    await this.db.query("update refresh_tokens set revoked_at = now() where id = $1", [tokenId]);
  }

  async getCustomerProfile(customerId: string) {
    const result = await this.db.query("select * from users where id = $1 limit 1", [customerId]);
    if (!result.rows[0]) {
      throw new NotFoundError("Customer not found");
    }
    return mapCustomer(result.rows[0]);
  }

  async updateCustomerProfile(customerId: string, payload: Partial<CustomerProfile>) {
    const result = await this.db.query(
      `update users
       set name = coalesce($2, name),
           email = coalesce($3, email),
           emergency_contact = coalesce($4, emergency_contact),
           preferred_payment_method = coalesce($5, preferred_payment_method),
           updated_at = now()
       where id = $1
       returning *`,
      [customerId, payload.name ?? null, payload.email ?? null, payload.emergencyContact ?? null, payload.preferredPaymentMethod ?? null]
    );

    if (!result.rows[0]) {
      throw new NotFoundError("Customer not found");
    }

    return mapCustomer(result.rows[0]);
  }

  async getLandmarks() {
    const result = await this.db.query("select * from landmarks where status = 'active' order by name asc");
    return result.rows.map(mapLandmark);
  }

  async getCustomerRideHistory(customerId: string) {
    const result = await this.db.query(
      "select * from rides where customer_id = $1 order by booked_at desc",
      [customerId]
    );
    return result.rows.map(mapRide);
  }

  async getActiveCustomerRide(customerId: string) {
    const result = await this.db.query(
      `select * from rides
       where customer_id = $1
         and status not in ('payment_completed', 'cancelled_by_user', 'cancelled_by_driver', 'cancelled_by_admin')
       order by booked_at desc
       limit 1`,
      [customerId]
    );

    return result.rows[0] ? mapRide(result.rows[0]) : null;
  }

  async createComplaint(payload: {
    rideId: string;
    raisedByType: "customer" | "driver";
    raisedById: string;
    complaintType: string;
    description: string;
  }) {
    const result = await this.db.query(
      `insert into complaints (id, ride_id, raised_by_type, raised_by_id, complaint_type, description, resolution_status)
       values ($1, $2, $3, $4, $5, $6, 'open')
       returning *`,
      [randomUUID(), payload.rideId, payload.raisedByType, payload.raisedById, payload.complaintType, payload.description]
    );
    return mapComplaint(result.rows[0]);
  }

  async getDriverProfile(driverId: string) {
    const result = await this.db.query("select * from drivers where id = $1 limit 1", [driverId]);
    if (!result.rows[0]) {
      throw new NotFoundError("Driver not found");
    }
    return mapDriver(result.rows[0]);
  }

  async updateDriverAvailability(driverId: string, payload: { isOnline: boolean; latitude?: number; longitude?: number }) {
    const result = await this.db.query(
      `update drivers
       set is_online = $2,
           current_latitude = coalesce($3, current_latitude),
           current_longitude = coalesce($4, current_longitude),
           updated_at = now()
       where id = $1
       returning *`,
      [driverId, payload.isOnline, payload.latitude ?? null, payload.longitude ?? null]
    );

    if (!result.rows[0]) {
      throw new NotFoundError("Driver not found");
    }
    return mapDriver(result.rows[0]);
  }

  async getDriverRequests(driverId: string) {
    const result = await this.db.query(
      `select * from rides
       where driver_id = $1 and status in ('driver_assigned', 'driver_arriving')
       order by booked_at desc`,
      [driverId]
    );
    return result.rows.map(mapRide);
  }

  async getDriverHistory(driverId: string) {
    const result = await this.db.query("select * from rides where driver_id = $1 order by booked_at desc", [driverId]);
    return result.rows.map(mapRide);
  }

  async getActiveDriverRide(driverId: string) {
    const result = await this.db.query(
      `select * from rides
       where driver_id = $1
         and status not in ('payment_completed', 'cancelled_by_user', 'cancelled_by_driver', 'cancelled_by_admin')
       order by booked_at desc
       limit 1`,
      [driverId]
    );

    return result.rows[0] ? mapRide(result.rows[0]) : null;
  }

  async getDriverEarnings(driverId: string) {
    const result = await this.db.query(
      `select
         count(*)::int as total_completed_rides,
         coalesce(sum(amount), 0)::numeric as gross_collected,
         coalesce(sum(driver_earning), 0)::numeric as pending_payout
       from payments
       where driver_id = $1 and payment_status = 'completed'`,
      [driverId]
    );

    const row = result.rows[0];
    return {
      totalCompletedRides: Number(row.total_completed_rides),
      grossCollected: Number(row.gross_collected),
      pendingPayout: Number(row.pending_payout),
    };
  }

  async getRideCategoryByKey(categoryKey: RideCategory["key"]) {
    const result = await this.db.query("select * from ride_categories where key = $1 and is_active = true limit 1", [categoryKey]);
    if (!result.rows[0]) {
      throw new NotFoundError("Ride category not found");
    }
    return mapRideCategory(result.rows[0]);
  }

  async listRideCategories() {
    const result = await this.db.query("select * from ride_categories order by name asc");
    return result.rows.map(mapRideCategory);
  }

  async getEligibleDrivers(categoryKey: RideCategory["key"]) {
    const result = await this.db.query(
      `select * from drivers
       where status = 'approved' and is_online = true and vehicle_type = $1`,
      [categoryKey]
    );
    return result.rows.map(mapDriver);
  }

  async createRide(payload: {
    customerId: string;
    driverId?: string;
    categoryKey: RideCategory["key"];
    pickupAddress: string;
    dropAddress: string;
    pickupNote?: string;
    dropNote?: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropLatitude: number;
    dropLongitude: number;
    estimatedDistanceKm: number;
    estimatedFare: number;
    paymentMethod: PaymentMethod;
    status: RideStatus;
    acceptedAt?: Date;
  }) {
    const result = await this.db.query(
      `insert into rides (
         id, customer_id, driver_id, category_key, pickup_address, drop_address, pickup_note, drop_note,
         pickup_latitude, pickup_longitude, drop_latitude, drop_longitude, estimated_distance_km, estimated_fare,
         status, payment_method, payment_status, booked_at, accepted_at
       ) values (
         $1, $2, $3, $4, $5, $6, $7, $8,
         $9, $10, $11, $12, $13, $14,
         $15, $16, 'pending', now(), $17
       ) returning *`,
      [
        randomUUID(),
        payload.customerId,
        payload.driverId ?? null,
        payload.categoryKey,
        payload.pickupAddress,
        payload.dropAddress,
        payload.pickupNote ?? null,
        payload.dropNote ?? null,
        payload.pickupLatitude,
        payload.pickupLongitude,
        payload.dropLatitude,
        payload.dropLongitude,
        payload.estimatedDistanceKm,
        payload.estimatedFare,
        payload.status,
        payload.paymentMethod,
        payload.acceptedAt ?? null,
      ]
    );

    return mapRide(result.rows[0]);
  }

  async getRideById(rideId: string) {
    const result = await this.db.query("select * from rides where id = $1 limit 1", [rideId]);
    if (!result.rows[0]) {
      throw new NotFoundError("Ride not found");
    }
    return mapRide(result.rows[0]);
  }

  async updateRideStatus(rideId: string, status: RideStatus) {
    const result = await this.db.query(
      `update rides
       set status = $2,
           payment_status = case when $2 = 'trip_completed' then 'recorded' else payment_status end,
           final_fare = case when $2 = 'trip_completed' then estimated_fare else final_fare end,
           arrived_at = case when $2 = 'driver_arrived' then now() else arrived_at end,
           started_at = case when $2 = 'trip_started' then now() else started_at end,
           completed_at = case when $2 = 'trip_completed' then now() else completed_at end,
           cancelled_at = case when $2 in ('cancelled_by_user', 'cancelled_by_driver', 'cancelled_by_admin') then now() else cancelled_at end
       where id = $1
       returning *`,
      [rideId, status]
    );

    if (!result.rows[0]) {
      throw new NotFoundError("Ride not found");
    }
    return mapRide(result.rows[0]);
  }

  async recordPaymentCompletion(rideId: string, driverId?: string) {
    const ride = await this.getRideById(rideId);
    const finalFare = ride.finalFare ?? ride.estimatedFare;
    const driverEarning = Number((finalFare * (1 - appConfig.pilotCommissionRate)).toFixed(2));
    const platformCommission = Number((finalFare * appConfig.pilotCommissionRate).toFixed(2));

    await this.db.query(
      `update rides
       set payment_status = 'completed', status = 'payment_completed', final_fare = $2
       where id = $1`,
      [rideId, finalFare]
    );

    await this.db.query(
      `insert into payments (id, ride_id, driver_id, amount, payment_method, payment_status, driver_earning, platform_commission, transaction_reference)
       values ($1, $2, $3, $4, $5, 'completed', $6, $7, $8)
       on conflict (ride_id) do update
       set amount = excluded.amount,
           payment_method = excluded.payment_method,
           payment_status = excluded.payment_status,
           driver_earning = excluded.driver_earning,
           platform_commission = excluded.platform_commission,
           transaction_reference = excluded.transaction_reference`,
      [randomUUID(), rideId, driverId ?? ride.driverId ?? null, finalFare, ride.paymentMethod, driverEarning, platformCommission, `txn_${rideId}`]
    );

    return {
      ride: await this.getRideById(rideId),
      driverEarning,
      platformCommission,
    };
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [
      ridesResult,
      customersResult,
      driversResult,
      paymentsResult,
      routesResult,
    ] = await Promise.all([
      this.db.query("select status, count(*)::int as count from rides group by status"),
      this.db.query("select count(*)::int as count from users"),
      this.db.query("select count(*)::int as count from drivers where is_online = true"),
      this.db.query(
        `select coalesce(sum(amount),0)::numeric as gross_revenue,
                coalesce(sum(platform_commission),0)::numeric as platform_commission
         from payments where payment_status = 'completed'`
      ),
      this.db.query(
        `select pickup_address || ' -> ' || drop_address as route, count(*)::int as total
         from rides group by route order by total desc limit 5`
      ),
    ]);

    const rideCounts = new Map<string, number>(
      ridesResult.rows.map((row: Record<string, unknown>) => [String(row.status), Number(row.count)])
    );

    return {
      totalRidesToday: Array.from(rideCounts.values()).reduce<number>((sum, count) => sum + Number(count), 0),
      completedRides: rideCounts.get("payment_completed") ?? 0,
      cancelledRides:
        (rideCounts.get("cancelled_by_user") ?? 0) +
        (rideCounts.get("cancelled_by_driver") ?? 0) +
        (rideCounts.get("cancelled_by_admin") ?? 0),
      activeDrivers: Number(driversResult.rows[0].count),
      activeCustomers: Number(customersResult.rows[0].count),
      grossRevenue: Number(paymentsResult.rows[0].gross_revenue),
      platformCommission: Number(paymentsResult.rows[0].platform_commission),
      topRoutes: routesResult.rows.map((row: Record<string, unknown>) => String(row.route)),
      peakBookingHours: ["08:00-10:00", "17:00-20:00"],
    };
  }

  async listDrivers() {
    const result = await this.db.query("select * from drivers order by created_at desc");
    return result.rows.map(mapDriver);
  }

  async listCustomers() {
    const result = await this.db.query("select * from users order by created_at desc");
    return result.rows.map(mapCustomer);
  }

  async listRides() {
    const result = await this.db.query("select * from rides order by booked_at desc");
    return result.rows.map(mapRide);
  }

  async listRidesForPrincipal(principal: { id: string; role: "customer" | "driver" | "admin" }) {
    if (principal.role === "admin") {
      return this.listRides();
    }

    const result = await this.db.query(
      principal.role === "customer"
          ? "select * from rides where customer_id = $1 order by booked_at desc"
          : "select * from rides where driver_id = $1 order by booked_at desc",
      [principal.id]
    );

    return result.rows.map(mapRide);
  }

  async listComplaints() {
    const result = await this.db.query("select * from complaints order by created_at desc");
    return result.rows.map(mapComplaint);
  }

  async listZones() {
    const result = await this.db.query("select * from service_zones order by zone_name asc");
    return result.rows.map(mapZone);
  }

  async updateDriverStatus(driverId: string, status: VerificationStatus) {
    const result = await this.db.query("update drivers set status = $2, updated_at = now() where id = $1 returning *", [
      driverId,
      status,
    ]);
    if (!result.rows[0]) {
      throw new NotFoundError("Driver not found");
    }
    return mapDriver(result.rows[0]);
  }

  async updateCategory(categoryId: string, payload: Pick<RideCategory, "baseFare" | "minimumFare" | "perKmRate" | "perMinuteRate" | "waitingCharge" | "cancellationFee">) {
    const result = await this.db.query(
      `update ride_categories
       set base_fare = $2,
           minimum_fare = $3,
           per_km_rate = $4,
           per_minute_rate = $5,
           waiting_charge = $6,
           cancellation_fee = $7
       where id = $1
       returning *`,
      [categoryId, payload.baseFare, payload.minimumFare, payload.perKmRate, payload.perMinuteRate, payload.waitingCharge, payload.cancellationFee]
    );

    if (!result.rows[0]) {
      throw new NotFoundError("Category not found");
    }
    return mapRideCategory(result.rows[0]);
  }

  async resolveComplaint(complaintId: string, payload: { resolutionStatus: ComplaintRecord["resolutionStatus"]; resolutionNote: string }) {
    const result = await this.db.query(
      `update complaints
       set resolution_status = $2,
           resolution_note = $3,
           resolved_at = case when $2 = 'resolved' then now() else resolved_at end
       where id = $1
       returning *`,
      [complaintId, payload.resolutionStatus, payload.resolutionNote]
    );
    if (!result.rows[0]) {
      throw new NotFoundError("Complaint not found");
    }
    return mapComplaint(result.rows[0]);
  }

  async getSummaryReport() {
    const [categories, payments, complaints] = await Promise.all([
      this.db.query(
        `select rc.name as category, count(r.id)::int as ride_count
         from ride_categories rc
         left join rides r on r.category_key = rc.key and r.payment_status = 'completed'
         group by rc.name
         order by rc.name asc`
      ),
      this.db.query(
        `select payment_method, count(*)::int as total
         from payments where payment_status = 'completed'
         group by payment_method`
      ),
      this.db.query("select count(*)::int as total from complaints where resolution_status <> 'resolved'")
    ]);

    return {
      ridesPerCategory: categories.rows.map((row: Record<string, unknown>) => ({
        category: String(row.category),
        rideCount: Number(row.ride_count),
      })),
      paymentMix: {
        cash: Number((payments.rows as Record<string, unknown>[]).find((row) => row.payment_method === "cash")?.total ?? 0),
        upi: Number((payments.rows as Record<string, unknown>[]).find((row) => row.payment_method === "upi")?.total ?? 0),
      },
      complaintOpenCount: Number(complaints.rows[0].total),
    };
  }
}
