let cruises;

$(document).ready(function() {
    console.log('usersjs.js is loaded...');
    listenForBookings();
    $.getJSON("/cruises.json", function(result){
        cruises=result;
      });
  })

function listenForBookings() {
    $('#bookings').on('click', () => showBookings());
    $('#newBooking').on('click', () => newBooking());
}

function listenForSubmit() {
    $('form').submit(function(event) {
        event.preventDefault();
        var values = $(this).serialize();
        createNewBooking(values);
      });

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

function newBooking(){
    let myBooking = Booking.newForm();
    $("#newBookingDiv").html(myBooking);
    populateSelectCruise();
    listenForSubmit();
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
      static newForm() {
          return (`<form class="new_booking">
          <select name="booking[cruise_id]" id="booking_cruise_id">
            <option value="None">Select cruise</option><br>
          </select>  
          <div>
            <label for="booking_number_adults">Number adults</label>
          </div>
          <div>
            <input min="0" type="number" name="booking[num_adults]" id="booking_num_adults" />
          </div>
          <div>
                <label for="booking_number_children">Number children</label>
            </div>
            <div>
                <input min="0" type="number" value="0" name="booking[num_children]" id="booking_num_children" />
            </div>
          <button id = "submit" type="submit" class="btn btn-primary">Submit</button>
          </form>`)
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
      <p>Adults: ${this.num_adults}, Children: ${this.num_children}</p>
      <p><a href="/bookings/${this.id}">Edit or Cancel</a></p></div>`)
  }

  function populateSelectCruise(){
      var ddList = document.getElementById('booking_cruise_id');
      cruises.forEach(function(cruise) {
          let html = `<option value="${cruise["id"]}"` + `>${cruise["name"]}</option>`
          ddList.innerHTML +=html;
      })
  }

  function createNewBooking(values) {
      $.ajax({
        type: 'POST',
        url: '/bookings',
        data: values
      }).done(function(data){
        newBooking = new Booking(data);
        $("#newBookingDiv").hide();
        showBookings();     
      }); 
  }

  


 function addBookingItem(booking) {
    let id =  booking.id;
    let elem = "#booking-" + id;
    if ($(elem).length === 0){
        let bookingListItem = '<li>' + "Booking for " + booking.cruise + "   " +
        '<button class="btn btn-sm" id= ' + `"booking-${id}"` + '> View Details </button>' +
        '<div id = ' + `"list-${id}"` + '></div></li>';
        $("#bookingsList").append(bookingListItem);
        $(`#booking-${id}`).click(function() {
           
            if ($( this ).text()===" View Details ") {
                if ($(`#list-${id}`).text() ==="")
                   booking.showDetails(); 
                else {
                    $(`#list-${id}`).show();                 
                }
                $(this).text(" Hide Details ")                           
            } else {
                $(this).text(" View Details ");
                $(`#list-${id}`).hide();
            }
        });
   }
}
  