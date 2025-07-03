const imgDiv=document.querySelector('.user-img');
const img=document.querySelector('#photo');
const file=document.querySelector('#file');
const uploadbtn=document.querySelector('#uploadbtn');

file.addEventListener('change',function(){
    const chosedfile=this.file[0];
    if(chosedfile){
        const reader=new FileReader();

        reader.addEventListener('load',function(){
            img.setAttribute('src',reader.result);
        })
        reader.readAsDataURL(chosedfile);
    }
})

document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
  
    profileForm.addEventListener('submit', function(event) {
      event.preventDefault();
      alert('Profile updated successfully!');
    });
  });
  var storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    document.getElementById('username').innerText = storedUsername;
  }
  document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    var fullName = document.getElementById('fullNameInput').value;
    document.getElementById('username').innerText = fullName;
  });


  function upcoming() {
    var tableContainer = document.getElementById("table-container");
    var tableContent = `
        <table class="content-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Departure</th>
                    <th>Destination</th>
                    <th>Departure Time</th>
                    <th>Arrival Time</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>5/05/24</td>
                    <td>Spice jet</td>
                    <td>Prayagraj</td>
                    <td>Lucknow</td>
                    <td>10:20am</td>
                    <td>11:00am</td>
                    <td>Ontime</td>
                </tr>
                <!-- Add more rows for upcoming trips if needed -->
            </tbody>
        </table>
    `;
    tableContainer.innerHTML = tableContent;
}

function refund() {
    var tableContainer = document.getElementById("table-container");
    var tableContent = `
        <table class="content-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Departure</th>
                    <th>Destination</th>
                    <th>Departure Time</th>
                    <th>Arrival Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2/05/24</td>
                    <td>Indigo</td>
                    <td>Prayagraj</td>
                    <td>Delhi</td>
                    <td>4:00am</td>
                    <td>5:40am</td>
                </tr>
            </tbody>
        </table>
    `;
    tableContainer.innerHTML = tableContent;
}

function completed() {
    var tableContainer = document.getElementById("table-container");
    var tableContent = `
        <table class="content-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Departure</th>
                    <th>Destination</th>
                    <th>Departure Time</th>
                    <th>Arrival Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>18/04/24</td>
                    <td>Spice jet</td>
                    <td>Delhi</td>
                    <td>Mumbai</td>
                    <td>3:30pm</td>
                    <td>7:00pm</td>
                </tr>
            </tbody>
        </table>
    `;
    tableContainer.innerHTML = tableContent;
}
  