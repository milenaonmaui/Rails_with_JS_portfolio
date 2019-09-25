
$(document).ready(function() {
    console.log('users.js is loaded...');
  });

function listenForBookings() {
    $('button#bookings').on('click'), function(event){
        showBookings()
    }
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
        }
    });
}

function generateList(userId) {
    $.ajax({
        url: '/users/' + userId,
        metod: 'GET',
        dataType: 'json'               
      }).done(function(data){
        var bookingsList = "";
        let myBooking;
        data["bookings"].forEach(function(el){
            myBooking = new Booking(el);
            console.log(myBooking.formatDate());
            let elemId = el["id"]
            bookingsList += '<li>' + "Booking for " + myBooking.cruise + "   " +
            '<button id= ' + `"booking-${elemId}"` + '> View </button>' +
            '<p id = ' + `"list-${elemId}"` + '></p></li>';
        });
        $("#listBookings").html(bookingsList);    
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

// $("p#list-1").append("text")