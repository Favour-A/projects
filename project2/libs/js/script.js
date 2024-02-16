
const activeSearch = document.querySelectorAll(".tab-pane");
const addButton = document.getElementById("addBtn");
const departmentFilter = document.getElementById("departmentFilter");
const locationFilter = document.getElementById("locationFilter");
const firstFilter = document.getElementById("firstFilter");
const filterContainer = document.getElementById("filtercontainer");
const filter = document.getElementById("filter");
const filterByDepartment = document.getElementById("filterPersonnelByDepartment");
const filterByLocation = document.getElementById("filterPersonnelByLocation");
const filterBtn = document.getElementById("filterBtn");
let where = "";
let clickedDept = 0;
let clickedLoc = 0;
  
$("document").ready(function () {


let personnel = [];
let department = [];
let locationArray = [];

const mySearch = (input) => {
  activeSearch.forEach((tab) => {

    if(tab.classList.contains("active")){
      const table = tab.querySelector("tbody");
      if(tab.id === 'personnel-tab-pane'){
        const filterPersonnel = personnel.filter((person) => {
          return person.firstName.toLowerCase().includes(input.toLowerCase()) || person.lastName.toLowerCase().includes(input.toLowerCase());
        
        });
        table.innerHTML = filterPersonnel.map((person) => {
          return `
          <tr>
                  <td class="align-middle text-nowrap">
                    ${person.lastName}, ${person.firstName}
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${person.department}
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${person.location}
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${person.email}
                  </td>
                  <td class="text-end text-nowrap">
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${person.id}">
                      <i class="fa-solid fa-pencil fa-fw"></i>
                    </button>
                    <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${person.id}">
                      <i class="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>`
        }).join("");

      }
      else if(tab.id === 'departments-tab-pane'){
        const table = tab.querySelector("tbody");
        const filterDepartment = department.filter((department) => {
          return department.name.toLowerCase().includes(input.toLowerCase());
          
        });
        table.innerHTML = filterDepartment.map((department) => {
          return `
          <tr>
          <td class="align-middle text-nowrap">
            ${department.name}
          </td>
          <td class="align-middle text-nowrap d-none d-md-table-cell">
            ${department.locationID}
          </td>
          <td class="align-middle text-end text-nowrap">
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.id}">
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" id="deleteDepartmentBtn" data-id="${department.id}">
              <i class="fa-solid fa-trash fa-fw"></i>
            </button>
          </td> `
      }).join("");
      const deleteDepartmentBtn = document.querySelectorAll("#deleteDepartmentBtn");
      deleteDepartmentBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
         deleteDepartment(btn.dataset.id);
         clickedDept = btn.dataset.id;
        })
      });
    }
      else if(tab.id === 'locations-tab-pane'){
        const table = tab.querySelector("tbody");
        const filterLocation = locationArray.filter((location) => {
          return location.name.toLowerCase().includes(input.toLowerCase());
        });
        table.innerHTML = filterLocation.map((location) => {
          return `
          <tr>
                  <td class="align-middle text-nowrap">
                    ${location.name}
                  </td>
                  <td class="align-middle text-end text-nowrap">
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.id}">
                      <i class="fa-solid fa-pencil fa-fw"></i>
                    </button>
                    <button type="button" class="btn btn-primary btn-sm" id= "deleteLocationBtn" data-id="${location.id}">
                      <i class="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>`
      }).join("");
      const deleteLocationBtn = document.querySelectorAll("#deleteLocationBtn");
      deleteLocationBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
          deleteLocation(btn.dataset.id);
          clickedloc = btn.dataset.id;
        })
      }); 
      }
}}
)};

$('#filterPersonnelModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: "./libs/php/getLocationandDept.php",
    type: "POST",
    dataType: "json",

    success: function (result) {
      document.getElementById("filterPersonnelByDepartment").innerHTML = `
        <option value="0" selected>All</option>
        ${result.department.map(department => `<option value="${department.id}">${department.name}</option>`).join("")}
      `;

      document.getElementById("filterPersonnelByLocation").innerHTML = `
        <option value="0" selected>All</option>
        ${result.location.map(location => `<option value="${location.id}">${location.name}</option>`).join("")}
      `;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterPersonnelModal .modal-title").replaceWith("Error retrieving data");
    }
  });
});

function filterPersonnel(val, where) {

    if(where === "department"){
      $.ajax({
        url: "./libs/php/filter.php",
        type: "POST",
        dataType: "json",
        data: {
          id: val,
          where: "department"
        },
        success: function (result) {
          const personnels = document.getElementById("personnelInfo");
          personnel = result.data;
          personnels.innerHTML = result.data.map((personnel) => {
            return `
            <tr>
                    <td class="align-middle text-nowrap">
                      ${personnel.lastName}, ${personnel.firstName}
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${personnel.department}
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${personnel.location}
                    </td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">
                      ${personnel.email}
                    </td>
                    <td class="text-end text-nowrap">
                      <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal"data-id="${personnel.id}">
                        <i class="fa-solid fa-pencil fa-fw"></i>
                      </button>
                      <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${personnel.id}">
                        <i class="fa-solid fa-trash fa-fw"></i>
                      </button>
                    </td>
                  </tr>`
          }).join("");
          
          },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#personnelTable tbody").html(
            $("<tr>").append(
              $("<td>", {
                colspan: 6,
                text: "No data found"
              })
            )
          );
        }
      });
    }
    else if(where === "location"){
      $.ajax({
        url: "./libs/php/filter.php",
        type: "POST",
        dataType: "json",
        data: {
          id: val,
          where: "location"
        },
        success: function (result) {
          const personnels = document.getElementById("personnelInfo");
        personnel = result.data;
        personnels.innerHTML = result.data.map((personnel) => {

          return `
           <tr>
                  <td class="align-middle text-nowrap">
                    ${personnel.lastName}, ${personnel.firstName}
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${personnel.department}
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${personnel.location}
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${personnel.email}
                  </td>
                  <td class="text-end text-nowrap">
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${personnel.id}">
                      <i class="fa-solid fa-pencil fa-fw"></i>
                    </button>
                    <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${personnel.id}">
                      <i class="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>`
        }).join("");
        
          },
          error: function (jqXHR, textStatus, errorThrown) {
            $("#personnelTable tbody").html(
              $("<tr>").append(
                $("<td>", {
                  colspan: 6,
                  text: "No data found"
                })
              )
            );
          }
        });
      }
  };


filterByDepartment.addEventListener("change", (e) => {
  $("#filterPersonnelByLocation").val(0);
  filterPersonnel(e.target.value, "department");
});
filterByLocation.addEventListener("change", (e) => {
  $("#filterPersonnelByDepartment").val(0);
  filterPersonnel(e.target.value, "location");
});

$("#addPersonnelModal").on("show.bs.modal", function (e) {
    
  $.ajax({
    url: "./libs/php/getLocationandDept.php",
    type: "POST",
    dataType: "json",
    
    success: function (result) {
      document.getElementById("addPersonnelDepartment").innerHTML = result.department.map((department) => {
        return `
        <option value="${department.id}">${department.name}</option>
        `
      }).join("");
      
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  })
});

$("#addDepartmentModal").on("show.bs.modal", function (e) {

  $.ajax({
    url: "./libs/php/getLocationandDept.php",
    type: "POST",
    dataType: "json",
    
    success: function (result) {
      document.getElementById("locationID").innerHTML = result.location.map((location) => {
        return `
        <option value="${location.id}">${location.name}</option>
        `
      }).join("");

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });

})
$('#addBtn').click(function() {
  if ($("#personnelBtn").hasClass("active")) {
    $('#addPersonnelModal').modal('show');
 
  }
   else if ($("#locationsBtn").hasClass("active")) {
    $('#addLocationModal').modal('show');
  }
  else if ($("#departmentsBtn").hasClass("active")) {
    $('#addDepartmentModal').modal('show');

  }
});

$("#addPersonnelForm").on("submit", function (e) {
  e.preventDefault();
  
  $.ajax({
    url: "./libs/php/insertPersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: $("#addPersonnelFirstName").val(),
      lastName: $("#addPersonnelLastName").val(),
      jobTitle: $("#addPersonnelJobTitle").val(),
      email: $("#addPersonnelEmailAddress").val(),
      departmentID: $("#addPersonnelDepartment").val()
    },
    success: function (result) {
      var resultCode = result.status.code;
      
      if (resultCode == 200) {
        // Refresh personnel table
        getPersonnel();
        
        // Hide the modal
        $("#addPersonnelModal").modal("hide");
      } else {
        $("#addPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
      
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  })
});

$("#addDepartmentForm").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
    url: "./libs/php/insertDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      name: $("#departmentName").val(),
      locationID: $("#locationID").val()
    },
    success: function (result) {
      var resultCode = result.status.code;
      
      if (resultCode == 200) {
        // Refresh department table
        getDepartment();
        
        // Hide the modal
        $("#addDepartmentModal").modal("hide");
      } else {
        $("#addDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
      
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  })
}
);

$("#addLocationForm").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
    url: "./libs/php/insertLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      name: $("#locationName").val()
    },
    success: function (result) {
      var resultCode = result.status.code;
      
      if (resultCode == 200) {
        // Refresh location table
        getLocations();
        
        // Hide the modal
        $("#addLocationModal").modal("hide");
      } else {
        $("#addLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
      
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  })
}
);

let searchTimeout;

$("#searchInp").on("keyup", function () {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(function () {
    var searchText = $("#searchInp").val().trim(); // Trim to handle white spaces

    // if (searchText === "") {
    //   // If the search input is empty, clear the search results
    //   getPersonal();
    //   getDepartment();
    //   getLocations();
    //   return;
    // }
    mySearch(searchText);

  }, 500);
});



  $("#refreshBtn").click(function () {

    if($("#searchInp").val() !== "") {
      $("#searchInp").val("");
      getPersonnel();
      getDepartment();
      getLocations();
    }
    if($("#filter").val() !== "") {
      $("#filter").val("") && $("#filter").hide();

      getPersonnel();
    }

    if ($("#personnelBtn").hasClass("active")) {
      
      // Refresh personnel table
      getPersonnel();
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        getDepartment();
      } else {
        
        // Refresh location table
        getLocations();
      }
      
    }
    
  });
  
 
  
  $("#personnelBtn").click(function () {
    
    // Call function to refresh personnel table
    getPersonnel();
    filterBtn.disabled = false;
    
  });
  
  $("#departmentsBtn").click(function () {
    
    // Call function to refresh department table
    getDepartment();
    filterBtn.disabled = true;

  });
  
  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    getLocations();
    filterBtn.disabled = true;

  });
  
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    
    $.ajax({
      url:
        "./libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
  
         $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
          
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });
  
  // Executes when the form button with type="submit" is clicked
  
  $("#editPersonnelForm").on("submit", function (e) {
    
    e.preventDefault();
  
    $.ajax({
      url: "./libs/php/editPersonnel.php",
      type: "POST",
      dataType: "json",
      data: {
        firstName: $("#editPersonnelFirstName").val(),
        lastName: $("#editPersonnelLastName").val(),
        jobTitle: $("#editPersonnelJobTitle").val(),
        email: $("#editPersonnelEmailAddress").val(),
        departmentID: $("#editPersonnelDepartment").val(),
        id: $("#editPersonnelEmployeeID").val()
      },
      success: function (result) {
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
          // Refresh personnel table
          getPersonnel();
          
          // Hide the modal
          $("#editPersonnelModal").modal("hide");
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
        
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
      }
    })

    
  });
  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getLocationandDept.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id")
      },
      success: function (result) {
    
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
    
         document.getElementById("editDepartmentLocation").innerHTML = result.location.map((location) => {
            return `
            <option value="${location.id}">${location.name}</option>`
           }).join("");
        } else {
          $("#editDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    })

    $.ajax({
      url: "./libs/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id")
      },
      success: function (result) {
        
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
    
          $("#editDepartment").val(result.data[0].name);
          $("#editDepartmentLocation").val(result.data[0].locationID);
          $("#editDepartmentID").val(result.data[0].id);
        } else {
          $("#editDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    })
  });

  $("#editDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "./libs/php/editDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        name: $("#editDepartment").val(),
        locationID: $("#editDepartmentLocation").val(),
        id: $("#editDepartmentID").val()
      },
      success: function (result) {
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
          // Refresh department table
          getDepartment();
          
          // Hide the modal
          $("#editDepartmentModal").modal("hide");
        } else {
          $("#editDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
    })
  });

  $("#editLocationModal").on("show.bs.modal", function (e) {

    $.ajax({
      url: "./libs/php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id")
      },
      success: function (result) {

        var resultCode = result.status.code;

        if (resultCode == 200) {
          $("#editLocationName").val(result.data[0].name);
          $("#editLocationID").val(result.data[0].id);
        } else {
          $("#editLocationModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
        
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    })
  });

  $("#editLocationForm").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "./libs/php/editLocation.php",
      type: "POST",
      dataType: "json",
      data: {
        name: $("#editLocationName").val(),
        id: $("#editLocationID").val()
      },
      success: function (result) {
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
          // Refresh location table
          getLocations();
          
          // Hide the modal
          $("#editLocationModal").modal("hide");
        } else {
          $("#editLocationModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
    })
  });

 
  $("#deletePersonnelModal").on("show.bs.modal", function (e) {

    $.ajax({
      url: "./libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id")
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          $("#deletePersonnelID").val(result.data.personnel[0].id);
          $("#deleteName").html(result.data.personnel[0].firstName + " " + result.data.personnel[0].lastName);
        } else {
          $("#deletePersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      }
    })
    const deleteData = document.getElementById("deleteBtn");
    deleteData.addEventListener("click", () => {
    
    $.ajax({
      url: "./libs/php/deletePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id")
      },
      success: function (result) {
       
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
          // Refresh personnel table
          getPersonnel();
          
          // Hide the modal
          $("#deletePersonnelModal").modal("hide");
        } else {
          $("#deletePersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
    })
     
  })
  });

  function deleteDepartment(id) {
     $.ajax({
      url: "./libs/php/checkIfDeletable.php",
      type: "POST",
      dataType: "json",
      data: {
         id: id // Retrieves the data-id attribute from the calling button
       },
       success: function (result) {
       
         if (result.status.code == 200) {
           if (result.data[0].personnelCount == 0 || result.data[0].personnelCount == null) {
             $("#deleteDepartmentName").text(result.data[0].departmentName);
  
            $("#deleteDepartmentModal").modal("show");
          } else {
            $("#unableTodeleteDepartmentName").text(result.data[0].departmentName);
            $("#reason").text(result.data[0].personnelCount);
  
            $("#unableTodeleteDepartmentModal").modal("show");
          }
        } else {
          $("#deleteDepartmentName .modal-title").replaceWith("Error retrieving data");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#deleteDepartmentName .modal-title").replaceWith("Error retrieving data");
      }
    });
  };

  $("#deleteDepartmentModal").on("show.bs.modal", function (e) {
    const deleteDeptBtn = document.getElementById("deleteDeptBtn");
    deleteDeptBtn.addEventListener("click", (e) => {
    
    $.ajax({
      url: "./libs/php/deleteDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: clickedDept
      },
      success: function (result) {
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
          // Refresh department table
          getDepartment();
          
          // Hide the modal
          $("#deleteDepartmentModal").modal("hide");
        } else {
          $("#deleteDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
    })
    });
  });

  function deleteLocation(id) {
    $.ajax({
     url: "./libs/php/cantdeleteLocation.php",
     type: "POST",
     dataType: "json",
     data: {
        id: id // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
      
        if (result.status.code == 200) {
          if (result.data[0].departmentCount == 0 || result.data[0].departmentCount == null) {
            $("#deleteLocationName").text(result.data[0].locationName);
 
           $("#deleteLocationModal").modal("show");
         } else {
           $("#unableTodeleteLocationName").text(result.data[0].locationName);
           $("#locationReason").text(result.data[0].departmentCount);
 
           $("#unableToDeleteLocationModal").modal("show");
         }
       } else {
         $("#deleteLocationName .modal-title").replaceWith("Error retrieving data");
       }
     },
     error: function (jqXHR, textStatus, errorThrown) {
       $("#deleteLocationName .modal-title").replaceWith("Error retrieving data");
     }
   });
 };


  $("#deleteLocationModal").on("show.bs.modal", function (e) {
    const deleteLocationBtn = document.getElementById("deleteLocationBtn");
    deleteLocationBtn.addEventListener("click", () => {

    $.ajax({
      url: "./libs/php/deleteLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: clickedloc
      },
      success: function (result) {
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
          // Refresh location table
          getLocations();
          
          // Hide the modal
          $("#deleteLocationModal").modal("hide");
        } else {
          $("#deleteLocationModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
    })
    });
  });
  
  const getPersonnel = () => {
    //populates the personnel table
    $.ajax({
      url: "./libs/php/getAll.php",
      type: "POST",
      dataType: "json",
      success: function (result) {
        const personnels = document.getElementById("personnelInfo");
        personnel = result.data;

        personnels.innerHTML = result.data.map((personnel) => {
          return `
          <tr>
                  <td class="align-middle text-nowrap">
                    ${personnel.lastName}, ${personnel.firstName}
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${personnel.department}
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${personnel.location}
                  </td>
                  <td class="align-middle text-nowrap d-none d-md-table-cell">
                    ${personnel.email}
                  </td>
                  <td class="text-end text-nowrap">
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${personnel.id}">
                      <i class="fa-solid fa-pencil fa-fw"></i>
                    </button>
                    <button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${personnel.id}">
                      <i class="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>`
        }).join("");
        
        },
      
      error: function (jqXHR, textStatus, errorThrown) {
        $("#personnelTable tbody").html(
          $("<tr>").append(
            $("<td>", {
              colspan: 6,
              text: "No data found"
            })
          )
        );
      }
    });

  };

  getPersonnel();

  const getDepartment = () => {
    //popultes the department table
    $.ajax({
      url: "./libs/php/getAllDepartments.php",
      type: "POST",
      dataType: "json",
      success: function (result) {
        
        const departments = document.getElementById("personnelDepartments");
        department = result.data;

        departments.innerHTML = result.data.map((department) => {
          return `
          <tr>
          <td class="align-middle text-nowrap">
            ${department.name}
          </td>
          <td class="align-middle text-nowrap">
            ${department.locationID}
          </td> 

          <td class="align-middle text-end text-nowrap">
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.id}">
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm " id="deleteDepartmentBtn" data-id="${department.id}">
              <i class="fa-solid fa-trash fa-fw"></i>
            </button>
          </td>
        </tr> 
`
        }).join("");
        
        const deleteDepartmentBtn = document.querySelectorAll("#deleteDepartmentBtn");
        deleteDepartmentBtn.forEach((btn) => {
          btn.addEventListener("click", () => {
           deleteDepartment(btn.dataset.id);
           clickedDept = btn.dataset.id;
          })
        });
        
        },
      
      error: function (jqXHR, textStatus, errorThrown) {
        $("#departmentTable tbody").html(
          $("<tr>").append(
            $("<td>", {
              colspan: 6,
              text: "No data found"
            })
          )
        );
      }
    });

  };

  getDepartment();

const getLocations = () => {
  //populates the location table
  $.ajax({
    url: "./libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      const locations = document.getElementById("personnelLocations");
      locationArray = result.data;
      locations.innerHTML = result.data.map((location) => {
        return `
        <tr>
                <td class="align-middle text-nowrap">
                  ${location.name}
                </td>
                <td class="align-middle text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.id}">
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm"  id= "deleteLocationBtn" data-id="${location.id}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>
      `
      }).join("");
      const deleteLocationBtn = document.querySelectorAll("#deleteLocationBtn");
      deleteLocationBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
          deleteLocation(btn.dataset.id);
          clickedloc = btn.dataset.id;
        })
      }); 
    },

    error: function (jqXHR, textStatus, errorThrown) {
      $("#locationTable tbody").html(
        $("<tr>").append(
          $("<td>", {
            colspan: 6,
            text: "No data found"
          })
        )
      );
    }
      
  })};

  getLocations();

});