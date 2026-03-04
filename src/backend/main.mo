import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    isAvailable : Bool;
  };

  module MenuItem {
    public func compare(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      Text.compare(item1.name, item2.name);
    };
  };

  type OrderItem = {
    itemId : Nat;
    quantity : Nat;
    itemName : Text;
    price : Float;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    phone : Text;
    items : [OrderItem];
    totalAmount : Float;
    status : Text; // "pending", "confirmed", "ready"
    timestamp : Int;
  };

  type Booking = {
    id : Nat;
    customerName : Text;
    phone : Text;
    date : Text;
    time : Text;
    guestCount : Nat;
    status : Text; // "pending", "confirmed", "cancelled"
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  // State
  var nextMenuItemId = 1;
  var nextOrderId = 1;
  var nextBookingId = 1;

  let menuItems = Map.empty<Nat, MenuItem>();
  let orders = Map.empty<Nat, Order>();
  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Restaurant-specific functions
  public shared ({ caller }) func seedMenu() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let starters : [MenuItem] = [
      {
        id = nextMenuItemId;
        name = "Samosa";
        description = "Fried pastry with spiced potato filling";
        price = 2.5;
        category = "Starters";
        isAvailable = true;
      },
      {
        id = nextMenuItemId + 1;
        name = "Pakora";
        description = "Deep-fried vegetable fritters";
        price = 3.0;
        category = "Starters";
        isAvailable = true;
      },
    ];

    let mainCourse : [MenuItem] = [
      {
        id = nextMenuItemId + 2;
        name = "Butter Chicken";
        description = "Chicken in creamy tomato sauce";
        price = 12.0;
        category = "Main Course";
        isAvailable = true;
      },
      {
        id = nextMenuItemId + 3;
        name = "Paneer Tikka Masala";
        description = "Grilled paneer in spiced tomato sauce";
        price = 10.0;
        category = "Main Course";
        isAvailable = true;
      },
    ];

    let breads : [MenuItem] = [
      {
        id = nextMenuItemId + 4;
        name = "Naan";
        description = "Leavened Indian bread";
        price = 2.0;
        category = "Breads";
        isAvailable = true;
      },
      {
        id = nextMenuItemId + 5;
        name = "Roti";
        description = "Unleavened whole wheat bread";
        price = 1.5;
        category = "Breads";
        isAvailable = true;
      },
    ];

    let desserts : [MenuItem] = [
      {
        id = nextMenuItemId + 6;
        name = "Gulab Jamun";
        description = "Fried milk balls in sugar syrup";
        price = 3.5;
        category = "Desserts";
        isAvailable = true;
      },
      {
        id = nextMenuItemId + 7;
        name = "Kheer";
        description = "Rice pudding with cardamom";
        price = 3.0;
        category = "Desserts";
        isAvailable = true;
      },
    ];

    let drinks : [MenuItem] = [
      {
        id = nextMenuItemId + 8;
        name = "Mango Lassi";
        description = "Mango yogurt smoothie";
        price = 4.0;
        category = "Drinks";
        isAvailable = true;
      },
      {
        id = nextMenuItemId + 9;
        name = "Masala Chai";
        description = "Spiced Indian tea";
        price = 2.5;
        category = "Drinks";
        isAvailable = true;
      },
    ];

    let allItems = starters.concat(mainCourse).concat(breads).concat(desserts).concat(drinks);
    for (item in allItems.values()) {
      menuItems.add(item.id, item);
      nextMenuItemId += 1;
    };
  };

  public query ({ caller }) func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  public shared ({ caller }) func addMenuItem(item : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let newItem = {
      id = nextMenuItemId;
      name = item.name;
      description = item.description;
      price = item.price;
      category = item.category;
      isAvailable = item.isAvailable;
    };

    menuItems.add(nextMenuItemId, newItem);
    nextMenuItemId += 1;
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, updatedItem : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };

    let newItem = {
      id;
      name = updatedItem.name;
      description = updatedItem.description;
      price = updatedItem.price;
      category = updatedItem.category;
      isAvailable = updatedItem.isAvailable;
    };

    menuItems.add(id, newItem);
  };

  public shared ({ caller }) func removeMenuItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };

    menuItems.remove(id);
  };

  public shared ({ caller }) func placeOrder(customerName : Text, phone : Text, items : [OrderItem]) : async Nat {
    let totalAmount = items.foldLeft(
      0.0,
      func(acc, item) {
        acc + (item.price * item.quantity.toFloat());
      },
    );

    let order : Order = {
      id = nextOrderId;
      customerName;
      phone;
      items;
      totalAmount;
      status = "pending";
      timestamp = Time.now();
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order.id;
  };

  public query ({ caller }) func getOrder(id : Nat) : async ?Order {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.get(id);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(id, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func createBooking(customerName : Text, phone : Text, date : Text, time : Text, guestCount : Nat) : async Nat {
    let booking : Booking = {
      id = nextBookingId;
      customerName;
      phone;
      date;
      time;
      guestCount;
      status = "pending";
      timestamp = Time.now();
    };

    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking.id;
  };

  public query ({ caller }) func getBooking(id : Nat) : async ?Booking {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view bookings");
    };
    bookings.get(id);
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    bookings.values().toArray();
  };

  public shared ({ caller }) func updateBookingStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with status };
        bookings.add(id, updatedBooking);
      };
    };
  };
};
