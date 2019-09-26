
$(document).ready(function() {
    console.log('usersjs.js is loaded...');
    listenForBookings();
  });

function listenForBookings() {
    $('#bookings').on('click', () => showBookings());
    $('#newBooking').on('click', () => newBooking());
}

function showBookings() {
    console.log("in show bookings")
    let userId;

    $.ajax({
        type: 'GET',
        url: '/current_user',
        success: function(resp){
            userId = resp["id"];
            generateList(userId);
            $('button#bookings').attr("disabled", true);
        }
    });
}

function newBooking(){
    alert('New booking');
}

function generateList(userId) {
    $.ajax({
        url: '/users/' + userId,
        metod: 'GET',
        dataType: 'json'               
      }).done(function(data){
        let myBooking;
        data["bookings"].forEach(function(el){
            myBooking = new Booking(el);
            addBookingItem(myBooking);
        });   
    });
  }

  class Booking {
      constructor(obj) {
          this.id = obj.id;
          this.created_at = obj.created_at;
          this.num_children = obj.num_children;
          this.num_adults = obj.num_adults;
          this.cruise = obj.cruise;
      }
  }

  Booking.prototype.formatDate = function(){
    const monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = new Date(this.created_at)
    return date.getDate() + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear() + " at " + date.getHours() +":" + date.getMinutes();
  }

  Booking.prototype.showDetails = function(){
      $(`#list-${this.id}`).html(`<div><p><i>Cruise:<b> ${this.cruise} </b></i></p>
      <p><i>Created at: ${this.formatDate()}</i></p>
      <p>Adults: ${this.num_adults}, Children: ${this.num_children}</p></div>`)
      
  }


 function addBookingItem(booking) {
    let id =  booking.id;
    let bookingListItem = '<li>' + "Booking for " + booking.cruise + "   " +
    '<button id= ' + `"booking-${id}"` + '> View </button>' +
    '<div id = ' + `"list-${id}"` + '></div></li>';
    $("#bookingsList").append(bookingListItem);
    $(`#booking-${id}`).on('click', () => booking.showDetails());
  }
  
// $("p#list-1").append("text")