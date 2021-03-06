let cruises;

$(document).ready(function() {
    console.log('users.js loaded...');
    listenForBookings();
    $.getJSON("/cruises.json", function(result){
        cruises=result;
      });
  })

function listenForBookings() {
    $('#bookings').on('click', () => showBookings());
    $('#newBooking').on('click', () => newBooking());
    $('#sort').on('click', () =>sortBookings());

}

function sortBookings(){
    const url = '/users/1.json';

    fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then(resp => resp.json())
      .then(json => {
        json.bookings.sort(function(a, b) {
        var nameA = a.cruise.toUpperCase(); // ignore upper and lowercase
        var nameB = b.cruise.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        // names must be equal
        return 0;
      });
      console.log(json.bookings)
      json.bookings.forEach(function(item){
          let newItem = `<li>${item.cruise}</li>`
          $("#bookingsList").append(newItem)
      })
    });
}

function listenForSubmit() {
    $('form').submit(function(event) {
        event.preventDefault();
        let values = new FormData(this);
        createNewBooking(values);
      });

}

function showBookings() {
    let userId;
    fetch('/current_user', {
        method: 'GET',
        credentials: 'same-origin',
    })
      .then(resp => resp.json())
      .then(json => generateList(json["id"]));
}

function newBooking(){
    $("#newBookingDiv").show();
    let myBooking = Booking.newForm(); 
    $("#newBookingDiv").html(myBooking);
    populateSelectCruise();
    listenForSubmit();
}

function generateList(userId) {
    const url = '/users/' + userId +'.json';

    fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then(resp => resp.json())
      .then(json => generateBookings(json));
      
}
    
  function generateBookings(data){
    let myBooking;
    data["bookings"].forEach(function(el){
        myBooking = new Booking(el);
        addBookingItem(myBooking);
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
      let id = this.id
      $(`#list-${id}`).html(`<div><p><i>Cruise:<b> ${this.cruise} </b></i></p>
      <p><i>Created at: ${this.formatDate()}</i></p>
      <p>Adults: ${this.num_adults}, Children: ${this.num_children}</p>
      <p> <button class="btn btn-link" id="cancel-${id}"> Cancel </button></p></div>`)
      $(`#cancel-${id}`).on('click', () => cancelBooking(id))
  }

  function populateSelectCruise(){
      var ddList = document.getElementById('booking_cruise_id');
      cruises.forEach(function(cruise) {
          let html = `<option value="${cruise["id"]}"` + `>${cruise["name"]}</option>`
          ddList.innerHTML +=html;
      })
  }

  function createNewBooking(values) {
    const token = $('meta[name="csrf-token"]').attr('content');
    fetch('/bookings', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'X-CSRF-Token': token
        },
        body: values
    })
      .then(resp => resp.json())
      .then(json => postNewBooking(json));
}

function postNewBooking(json){
    let newBooking = new Booking(json);
    $("#newBookingDiv").hide();
    showBookings();
}
  
function addBookingItem(booking) {
    let id =  booking.id;
    let elem = "#booking-" + id;
    if ($(elem).length === 0){
        let bookingListItem = '<li id= ' + `"item-${id}"` + '><h3>' + "Booking for " + booking.cruise + "   " +
        '<button class="btn btn-link" id= ' + `"booking-${id}"` + '> View Details </button></h3>' +
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

function cancelBooking(id) {
    let resp = confirm(`Do you really want to cancel?`)
    if (resp) {
        $.ajax({
            type: 'DELETE',
            url: '/bookings/' + id
            
          }).done(function(data){
            $(`#item-${id}`).remove();    
          }); 
    }
}
