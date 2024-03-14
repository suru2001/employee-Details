
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const pageNumberElement = document.getElementById("pageNumber");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const employeeForm = document.getElementById("employeeForm");
const employeeTableBody = document.getElementById("employeeTableBody");
const form = document.getElementById("employeeForm");
 

function displayForm() {
  if (form.style.display === "none") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}
const  employees = [];
let currentPage = 1;
const entriesPerPage = 2;
const employeeData ={};

function addEmployee() {
  const employeeId = document.getElementById("employeeId").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const jobTitle = document.getElementById("jobTitle").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  employees.push({ employeeId, firstName, lastName, email, jobTitle, phone, address });

  const employeeData = {
      employeeId,
      firstName,
      lastName,
      email,
      jobTitle,
      phone,
      address
  };

  employees.push(employeeData); // Store the employee data in the array
  
  // updatePageNumber();
  // displayEntries();
  readEmployesDB();
  
  resetForm();

  addEmployeeToDatabase(employeeData); // Add employee data to the database
}

// function editButton(index) {
//   const employee = employees[index];
//   document.getElementById("employeeId").value = employee.employeeId;
//   document.getElementById("firstName").value = employee.firstName;
//   document.getElementById("lastName").value = employee.lastName;
//   document.getElementById("email").value = employee.email;
//   document.getElementById("jobTitle").value = employee.jobTitle;
//   document.getElementById("phone").value = employee.phone;
//   document.getElementById("address").value = employee.address;
  
// //   // Change the submit button text and functionality to update
// //   const updateButton = document.getElementById("update");
// //   updateButton.textContent = "Update";
// //   updateButton.onclick = function () {
// //     updateEmployee(index);
// //   };
// }

// function updateEmployee(index) {
//   const employeeId = document.getElementById("employeeId").value;
//   const firstName = document.getElementById("firstName").value;
//   const lastName = document.getElementById("lastName").value;
//   const email = document.getElementById("email").value;
//   const jobTitle = document.getElementById("jobTitle").value;
//   const phone = document.getElementById("phone").value;
//   const address = document.getElementById("address").value;
  
//   employees[index] = { employeeId, firstName, lastName, email, jobTitle, phone, address };
  
//   renderEmployees();
// }


function displayEntries(data){
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, employees.length);
  const currentPageData = employees.slice(startIndex, endIndex);
  employeeTableBody.innerHTML ="";
  currentPageData.forEach ((employee ,index)=>{
      const row = `<tr>
      <td>${index + startIndex + 1}</td>
      <td>${employee.employeeId}</td>
      <td>${employee.firstName}</td>
      <td>${employee.lastName}</td>
      <td>${employee.email}</td>
      <td>${employee.jobTitle}</td>
      <td>${employee.phone}</td>
      <td>${employee.address}</td>
      <td>
      <button onclick="editButton(${index + startIndex})"><i class="fa-solid fa-pen-to-square"></i>Edit</button>
      <button onclick="deleteEmployee(${index + startIndex})"><i class="fa-solid fa-trash"></i>Delete</button>
      </td>
      </tr>`;
    employeeTableBody.innerHTML += row;
  });
}

function resetForm (){
  document.getElementById("employeeId").value ="";
  document.getElementById("firstName").value ="";
  document.getElementById("lastName").value ="";
  document.getElementById("email").value ="";
  document.getElementById("jobTitle").value ="";
  document.getElementById("phone").value ="";
  document.getElementById("address").value ="";
  selectedRow =null ;
  clearFields();
  
}

function clearFields() {
  employeeForm.reset();
}

  
  function deleteEmployee1(index) {
    if(confirm("Are you sure you want to delete this record ?")){
      employees.splice(index ,1);
      renderEmployees();
      deleteEmployee();
    }
  }
  
  
  
  // page intiation code is here 
  
  
  
  function updatePageNumber() {
    pageNumberElement.textContent = currentPage;
  }
  
  
  
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePageNumber();
      displayEntries();
    }
  }
  
  function nextPage() {
    if (currentPage < Math.ceil(data.length / entriesPerPage)) {
      currentPage++;
      updatePageNumber();
      displayEntries();
    }
  }
  updatePageNumber();
  displayEntries();
  
  
  
  




const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const dbName = "EmployeeDatabase";
const dbVersion = 1;
const objectStoreName = "employeeData";

let db;

// Function to open IndexedDB database
function openDatabase() {
  const openRequest = indexedDB.open(dbName, dbVersion);
  
  openRequest.onupgradeneeded = function(event) {
    db = event.target.result;
    // Create object store if it doesn't exist
    if (!db.objectStoreNames.contains(objectStoreName)) {
      const objectStore = db.createObjectStore(objectStoreName, { autoIncrement: true });
      // Define indexes if needed
      objectStore.createIndex("firstName", "firstName", { unique: false });
      objectStore.createIndex("lastName", "lastName", { unique: false });
      objectStore.createIndex("email", "email", { unique: false  });
      objectStore.createIndex("jobTitle", "jobTitle", { unique: false });
      objectStore.createIndex("phone", "phone", { unique: false});
      objectStore.createIndex("address", "address", { unique: false });
    }
  };
  
  openRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database opened successfully");
  };
  
  openRequest.onerror = function(event) {
    console.error("Error opening IndexedDB:", event.target.error);
  };
}

// Function to add an employee to the db
function addEmployeeToDatabase(employeeData) {
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  const request = objectStore.add(employeeData);
  
  request.onsuccess = function(event) {
    console.log("Employee added to IndexedDB successfully");
  };
  
  request.onerror = function(event) {
    console.error("Error adding employee to IndexedDB:", event.target.error);
  };
}

function handleFormSubmission(event) {
  event.preventDefault();  
}

employeeForm.addEventListener("submit", handleFormSubmission);

openDatabase();


// Function to retrieve data from IndexedDB and render it
function readEmployesDB() {
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  const request = objectStore.getAll();

  request.onerror = function(event) {
      console.error("Error retrieving data:", event.target.error);
  };

  request.onsuccess = function(event) {
      const data = event.target.result;
      employeeTableBody.innerHTML = ""; 


      data.forEach((employeeData, index) => {
          const row = `<tr>
              <td>${index + 1}</td>
              <td>${employeeData.employeeId}</td>
              <td>${employeeData.firstName}</td>
              <td>${employeeData.lastName}</td>
              <td>${employeeData.email}</td>
              <td>${employeeData.jobTitle}</td>
              <td>${employeeData.phone}</td>
              <td>${employeeData.address}</td>
              <td>
                  <button onclick="editButton(${index})"><i class="fa-solid fa-pen-to-square"></i>Edit</button>
                  <button onclick="deleteEmployee(${index})"><i class="fa-solid fa-trash"></i>Delete</button>
              </td>
          </tr>`;
          employeeTableBody.innerHTML += row;
      });
  };
}

function readEmployesDB() {
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  const request = objectStore.getAll();

  request.onerror = function(event) {
      console.error("Error retrieving data:", event.target.error);
  };

  request.onsuccess = function(event) {
      const data = event.target.result;
      employeeTableBody.innerHTML = ""; 


      data.forEach((employeeData, index) => {
          const row = `<tr>
              <td>${index + 1}</td>
              <td>${employeeData.employeeId}</td>
              <td>${employeeData.firstName}</td>
              <td>${employeeData.lastName}</td>
              <td>${employeeData.email}</td>
              <td>${employeeData.jobTitle}</td>
              <td>${employeeData.phone}</td>
              <td>${employeeData.address}</td>
              <td>
                  <button onclick="editButton(${index})"><i class="fa-solid fa-pen-to-square"></i>Edit</button>
                  <button onclick="deleteEmployee(${index})"><i class="fa-solid fa-trash"></i>Delete</button>
              </td>
          </tr>`;
          employeeTableBody.innerHTML += row;
      });
  };
}
// Querying Data from IndexedDB:

//1. First Version: It uses getAll(index) to retrieve all records matching the provided index.
// Second Version: It uses getAll() to retrieve all records from the object store.
// Accessing Retrieved Data:

// 2.First Version: It attempts to access employeeData directly.
// Second Version: It first stores all retrieved employees in the employees array and then accesses the employee data using the provided index.
// Error Handling:

// 3.First Version: It logs an error message when the employee data is not found using the provided index.
// Second Version: It logs an error message when there's a general error retrieving data from the database.
// The modified version in the second version correctly retrieves data from IndexedDB using getAll(), accesses the data using the provided index, and handles errors appropriately.







function editButton(index) {
  console.log(index ,"edite Btn");
  const transaction = db.transaction(["employeeData"], "readonly");
  const objectStore = transaction.objectStore("employeeData");

  const request = objectStore.getAll();

  request.onsuccess = function(event) {
    const employees = event.target.result;
    const employeeData = employees[index];

    if (employeeData) {
      // Populate form fields with the retrieved data
      document.getElementById("employeeId").value = employeeData.employeeId;
      document.getElementById("firstName").value = employeeData.firstName;
      document.getElementById("lastName").value = employeeData.lastName;
      document.getElementById("email").value = employeeData.email;
      document.getElementById("jobTitle").value = employeeData.jobTitle;
      document.getElementById("phone").value = employeeData.phone;
      document.getElementById("address").value = employeeData.address;
        
      const submitButton = document.getElementById("update");
      submitButton.textContent = "Update";
      submitButton.onclick = function() {
        updateEmployee(index);
        console.log(index, "edit") ;
      };
    } else {
      console.error("Employee with index", index, "not found in database.");
    }
  };

  request.onerror = function(event) {
    console.error("Error retrieving employee data from database:", event.target.error);
  };
}

function updateEmployee(index) {
  const transaction = db.transaction(["employeeData"], "readwrite");
  const objectStore = transaction.objectStore("employeeData");

  // Retrieve the employee record using its key (which corresponds to the provided index)
  const getRequest = objectStore.get(index);

  getRequest.onsuccess = function(event) {
    const employee = event.target.result;

    if (employee) {
      // Update the employee object with the new data from the form fields
      employee.firstName = document.getElementById("firstName").value;
      employee.lastName = document.getElementById("lastName").value;
      employee.email = document.getElementById("email").value;
      employee.jobTitle = document.getElementById("jobTitle").value;
      employee.phone = document.getElementById("phone").value;
      employee.address = document.getElementById("address").value;
      console.log(index, "update ") ;


      // Put the updated employee record back into the object store
      const updateRequest = objectStore.put(employee, index+1); // Specify the index as the key


      updateRequest.onsuccess = function(event) {
        console.log("Employee at index", index, "updated successfully in database.");

        // Optionally, you can render the updated employees after successful update
        readEmployesDB();
      };

      updateRequest.onerror = function(event) {
        console.error("Error updating employee at index", index, "in database:", event.target.error);
      };
    } else {
      console.error("Employee at index", index, "not found in database.");
    }
  };

  getRequest.onerror = function(event) {
    console.error("Error retrieving employee at index", index, "from database:", event.target.error);
  };
}


// here we are getting all data updatetion which we dont want so we are trying out new thing 
// function updateEmployeesInRange(startIndex, endIndex) {
//   const transaction = db.transaction(["employeeData"], "readwrite");
//   const objectStore = transaction.objectStore("employeeData");

//   // Create a key range object with the specified start and end index
//   const keyRange = IDBKeyRange.bound(0, 100);

//   // Open a cursor within the specified key range
//   const cursorRequest = objectStore.openCursor(keyRange);

//   cursorRequest.onsuccess = function(event) {
//     const cursor = event.target.result;

//     if (cursor) {
//       // Update the employee object with the new data from the form fields
//       const employee = cursor.value;
//       employee.firstName = document.getElementById("firstName").value;
//       employee.lastName = document.getElementById("lastName").value;
//       employee.email = document.getElementById("email").value;
//       employee.jobTitle = document.getElementById("jobTitle").value;
//       employee.phone = document.getElementById("phone").value;
//       employee.address = document.getElementById("address").value;

//       // Put the updated employee record back into the object store
//       const updateRequest = cursor.update(employee);

//       updateRequest.onsuccess = function(event) {
//         console.log("Employee with key", cursor.key, "updated successfully in database.");
//       };

//       updateRequest.onerror = function(event) {
//         console.error("Error updating employee with key", cursor.key, "in database:", event.target.error);
//       };

//       // Move to the next cursor entry
//       cursor.continue();
//     } else {
//       console.log("No more records within the specified key range.");
//     }
//   };

//   cursorRequest.onerror = function(event) {
//     console.error("Error opening cursor:", event.target.error);
//   };
// }
// const updateButton = document.getElementById("update");

// updateButton.onclick = function() {
//   updateEmployeesInRange(startIndex, endIndex);
// };



// function updateEmployee(index) {
//   const transaction = db.transaction(["employeeData"], "readwrite");
//   const objectStore = transaction.objectStore("employeeData");
  
//   // Get the employee record from the object store using the provided index
//   const getRequest = objectStore.get(index);
  
//   getRequest.onsuccess = function(event) {
//     const employee = event.target.result;
    
//     if (employee) {
//       // Update the employee object with the new data from the form fields
//       employee.firstName = document.getElementById("firstName").value;
//       employee.lastName = document.getElementById("lastName").value;
//       employee.email = document.getElementById("email").value;
//       employee.jobTitle = document.getElementById("jobTitle").value;
//       employee.phone = document.getElementById("phone").value;
//       employee.address = document.getElementById("address").value;
      
//       // Put the updated employee record back into the object store
//       const updateRequest = objectStore.put(employee);
      
//       updateRequest.onsuccess = function(event) {
//         console.log("Employee at index", index, "updated successfully in database.");
        
//         // Optionally, you can render the updated employees after successful update
//         readEmployesDB();
//       };
      
//       updateRequest.onerror = function(event) {
//         console.error("Error updating employee at index", index, "in database:", event.target.error);
//       };
//     } else {
//       console.error("Employee at index", index, "not found in database.");
//     }
//   };
  
//   getRequest.onerror = function(event) {
//     console.error("Error retrieving employee at index", index, "from database:", event.target.error);
//   };
// }





function deleteEmployee(index) {
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  
  const request = objectStore.delete(index);
  
  request.onsuccess = function(event) {
    console.log("Record at index", index, "deleted from database successfully");
    
    // Additional debugging: Log the object store to see if the record is deleted
    objectStore.getAll().onsuccess = function(event) {
      console.log("Updated object store:", event.target.result);
    };
  };
  
  request.onerror = function(event) {
    console.error("Error deleting record at index", index, "from database:", event.target.error);
  };
}



// function deleteEmployee(index) {

//   const transaction = db.transaction(["employeeData"], "readwrite");

//   const objectStore = transaction.objectStore("employeeData");
//   const del= objectStore.delete(index);
//   console.log(del);

//   transaction.oncomplete = function() {
//     console.log("Transaction completed: Record with key", index, "deleted from IndexedDB.");
//   };

//   transaction.onerror = function(event) {
//     console.error("Transaction error:", event.target.error);
//   };
// }




// delete all things in fact whole data base 
function clearData() {
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  
  const request = objectStore.clear(); // delete all things in fact whole data base 
  
  request.onsuccess = function(event) {
    console.log("data base is deleted successfully");
    
    readEmployesDB();
    
  };
  
  request.onerror = function(event) {
    console.error("Error deleting database :", event.target.error);
  };
}


const searchButton = document.getElementById("searchButton");

const searchResults = [];

  function searchEmployees(query) {
    const transaction = db.transaction(['employeeData'], 'readonly');
    const objectStore = transaction.objectStore('employeeData');
    
     const request = objectStore.openCursor();
    request.onsuccess = function(event) {
    
    searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      searchEmployees();
    }
    });
    const cursor = event.target.result;
    if (cursor) {
      // Check if the current record matches the search query
      const employee = cursor.value;
      if (
        employee.firstName.toLowerCase().includes(query.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(query.toLowerCase()) ||
        employee.email.toLowerCase().includes(query.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(query.toLowerCase()) ||
        employee.phone.toLowerCase().includes(query.toLowerCase()) ||
        employee.address.toLowerCase().includes(query.toLowerCase())
        ) {
          console.log(searchResults);
        // searchResults.push(employee);
      }
      cursor.continue(); // Move to the next record
    } else {
      // No more records
      renderEmployees(searchResults); // Render the search results
    }
  };

  transaction.onerror = function(event) {
    console.error('Error searching employees:', event.target.error);
  };
}

searchButton.addEventListener('click', function(event) {
  event.preventDefault();
  
  const searchQuery = document.getElementById('searchInput').value;

  handleSearch(searchQuery);
});

function handleSearch(query) {
  console.log('Search query:', query);
  
}
