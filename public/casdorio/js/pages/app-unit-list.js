
'use strict';

document.addEventListener('DOMContentLoaded', function (e) {
  let borderColor, bodyBg, headingColor;

  borderColor = config.colors.borderColor;
  bodyBg = config.colors.bodyBg;
  headingColor = config.colors.headingColor;

  const dt_user_table = document.querySelector('.datatables-users'),
    statusObj = {
      1: { title: 'Pending', class: 'bg-label-warning' },
      2: { title: 'Active', class: 'bg-label-success' },
      3: { title: 'Inactive', class: 'bg-label-secondary' }
    };

  if (dt_user_table) {
    const dt_user = new DataTable(dt_user_table, {
      ajax: { 'url': 'api/v1/units', dataSrc: 'data.units' },
      columns: [
        // columns according to JSON
        { data: 'id' },
        { data: 'id', orderable: false, render: DataTable.render.select() },
        { data: 'full_name' },
        { data: 'modality' },
        { data: 'number_registration' },
        { data: 'phone' },
        { data: 'id' },
        { data: 'action' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          searchable: false,
          orderable: false,
          responsivePriority: 2,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
          // For Checkboxes
          targets: 1,
          orderable: false,
          searchable: false,
          responsivePriority: 4,
          checkboxes: true,
          render: function () {
            return '<input type="checkbox" class="dt-checkboxes form-check-input">';
          },
          checkboxes: {
            selectAllRender: '<input type="checkbox" class="form-check-input">'
          }
        },
        {
          targets: 2,
          responsivePriority: 3,
          render: function (data, type, full, meta) {
            var name = full['full_name'];
            var short_name = full['short_name'];
            var email = full['mail'];
            var image = full['avatar'];
            var output;

            if (image) {
              // For Avatar image
              output = '<img src="' + assetsPath + 'img/avatars/' + image + '" alt="Avatar" class="rounded-circle">';
            } else {
              // For Avatar badge
              var stateNum = Math.floor(Math.random() * 6);
              var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
              var state = states[stateNum];
              var initials = (name.match(/\b\w/g) || []).map(char => char.toUpperCase());
              initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
              output = '<span class="avatar-initial rounded-circle bg-label-' + state + '">' + initials + '</span>';
            }

            // Creates full output for row
            var row_output =
              '<div class="d-flex justify-content-start align-items-center user-name">' +
              '<div class="avatar-wrapper">' +
              '<div class="avatar avatar-sm me-4">' +
              output +
              '</div>' +
              '</div>' +
              '<div class="d-flex flex-column">' +
              '<a href="#" class="text-heading text-truncate"><span class="fw-medium">' +
              short_name +
              '</span></a>' +
              '<small>' +
              name +
              '</small>' +
              '</div>' +
              '</div>';
            return row_output;
          }
        },
        {
          targets: 3,
          render: function (data, type, full, meta) {
            var modality = full['modality'];

            return (
              "<span class='text-truncate d-flex align-items-center text-heading'>" +
              modality +
              '</span>'
            );
          }
        },
        {
          // Plans
          targets: 4,
          render: function (data, type, full, meta) {
            const plan = full['number_registration'];

            return '<span class="text-heading">' + plan + '</span>';
          }
        },
        {
          // User Status
          targets: 6,
          render: function (data, type, full, meta) {
            const status = full['id'];

            return (
              ''
            );
          }
        },
        {
          targets: -1,
          title: 'Actions',
          searchable: false,
          orderable: false,
          render: (data, type, full, meta) => {
            return `
              <div class="d-flex align-items-center">
                <a href="/unit/${full['id']}/unit_profile" class="btn btn-icon">
                  <i class="icon-base bx bx-show icon-md"></i>
                </a>
                <a href="javascript:;" class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                  <i class="icon-base bx bx-dots-vertical-rounded icon-md"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end m-0">
                  <a href="javascript:;" class="dropdown-item">Edit</a>
                  <a href="javascript:;" class="dropdown-item">Suspend</a>
                </div>
              </div>
            `;
          }
        }
      ],
      select: {
        style: 'multi',
        selector: 'td:nth-child(2)'
      },
      order: [[2, 'desc']],
      layout: {
        topStart: {
          rowClass: 'row mx-3 my-0 justify-content-between',
          features: [
            {
              pageLength: {
                menu: [10, 25, 50, 100],
                text: '_MENU_'
              }
            }
          ]
        },
        topEnd: {
          features: [
            {
              search: {
                placeholder: 'Buscar Unidades',
                text: '_INPUT_'
              }
            },
            {
              buttons: [
                {
                  text: '<i class="icon-base bx bx-plus icon-sm me-0 me-sm-2"></i><span class="d-none d-sm-inline-block">Cadastrar Unidade</span>',
                  className: 'btn-add-unit btn btn-primary'
                }
              ]
            }
          ]
        },
        bottomStart: {
          rowClass: 'row mx-3 justify-content-between',
          features: ['info']
        },
        bottomEnd: {
          paging: {
            firstLast: false
          }
        }
      },
      language: {
        sLengthMenu: '_MENU_',
        search: '',
        searchPlaceholder: 'Buscar Unidades',
        paginate: {
          next: '<i class="icon-base bx bx-chevron-right icon-18px"></i>',
          previous: '<i class="icon-base bx bx-chevron-left icon-18px"></i>'
        }
      },
      // For responsive popup
      responsive: {
        details: {
          display: DataTable.Responsive.display.modal({
            header: function (row) {
              const data = row.data();
              return 'Details of ' + data['full_name'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            const data = columns
              .map(function (col) {
                return col.title !== '' // Do not show row in modal popup if title is blank (for check box)
                  ? `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
                      <td>${col.title}:</td>
                      <td>${col.data}</td>
                    </tr>`
                  : '';
              })
              .join('');

            if (data) {
              const div = document.createElement('div');
              div.classList.add('table-responsive');
              const table = document.createElement('table');
              div.appendChild(table);
              table.classList.add('table');
              const tbody = document.createElement('tbody');
              tbody.innerHTML = data;
              table.appendChild(tbody);
              return div;
            }
            return false;
          }
        }
      },
      initComplete: function () {
        // const api = this.api();

        // // Helper function to create a select dropdown and append options
        // const createFilter = (columnIndex, containerClass, selectId, defaultOptionText) => {
        //   const column = api.column(columnIndex);
        //   const select = document.createElement('select');
        //   select.id = selectId;
        //   select.className = 'form-select text-capitalize';
        //   select.innerHTML = `<option value="">${defaultOptionText}</option>`;
        //   document.querySelector(containerClass).appendChild(select);

        //   // Add event listener for filtering
        //   select.addEventListener('change', () => {
        //     const val = select.value ? `^${select.value}$` : '';
        //     column.search(val, true, false).draw();
        //   });

        //   // Populate options based on unique column data
        //   const uniqueData = Array.from(new Set(column.data().toArray())).sort();
        //   uniqueData.forEach(d => {
        //     const option = document.createElement('option');
        //     option.value = d;
        //     option.textContent = d;
        //     select.appendChild(option);
        //   });
        // };

        // // Role filter
        // createFilter(3, '.user_role', 'UserRole', 'Select Role');

        // // Plan filter
        // createFilter(4, '.user_plan', 'UserPlan', 'Select Plan');

        // // Status filter
        // const statusFilter = document.createElement('select');
        // statusFilter.id = 'FilterTransaction';
        // statusFilter.className = 'form-select text-capitalize';
        // statusFilter.innerHTML = '<option value="">Select Status</option>';
        // document.querySelector('.user_status').appendChild(statusFilter);
        // statusFilter.addEventListener('change', () => {
        //   const val = statusFilter.value ? `^${statusFilter.value}$` : '';
        //   api.column(6).search(val, true, false).draw();
        // });

        // const statusColumn = api.column(6);
        // const uniqueStatusData = Array.from(new Set(statusColumn.data().toArray())).sort();
        // uniqueStatusData.forEach(d => {
        //   const option = document.createElement('option');
        //   option.value = statusObj[d]?.title || d;
        //   option.textContent = statusObj[d]?.title || d;
        //   option.className = 'text-capitalize';
        //   statusFilter.appendChild(option);
        // });

        const elementsToModify = [
          { selector: '.dt-buttons .btn', classToRemove: 'btn-secondary' },
          { selector: '.dt-search .form-control', classToRemove: 'form-control-sm' },
          { selector: '.dt-length .form-select', classToRemove: 'form-select-sm', classToAdd: 'ms-0' },
          { selector: '.dt-length', classToAdd: 'mb-md-6 mb-0' },
          { selector: '.dt-search', classToAdd: 'mb-md-6 mb-2' },
          {
            selector: '.dt-layout-end',
            classToRemove: 'justify-content-between',
            classToAdd: 'd-flex gap-md-4 justify-content-md-between justify-content-center gap-4 flex-wrap mt-0'
          },
          { selector: '.dt-layout-start', classToAdd: 'mt-0' },
          { selector: '.dt-buttons', classToAdd: 'd-flex gap-4 mb-md-0 mb-6' },
          { selector: '.dt-layout-table', classToRemove: 'row mt-2' },
          { selector: '.dt-layout-full', classToRemove: 'col-md col-12', classToAdd: 'table-responsive' }
        ];
    
        // Delete record
        elementsToModify.forEach(({ selector, classToRemove, classToAdd }) => {
          document.querySelectorAll(selector).forEach(element => {
            if (classToRemove) {
              classToRemove.split(' ').forEach(className => element.classList.remove(className));
            }
            if (classToAdd) {
              classToAdd.split(' ').forEach(className => element.classList.add(className));
            }
          });
        });

        $(".units-list-no").addClass("d-none");
        $(".units-list-yes").removeClass("d-none");
      }
    });

    //? The 'delete-record' class is necessary for the functionality of the following code.
    function deleteRecord(event) {
      let row = document.querySelector('.dtr-expanded');
      if (event) {
        row = event.target.parentElement.closest('tr');
      }
      if (row) {
        dt_user.row(row).remove().draw();
      }
    }

    function bindDeleteEvent() {
      const userListTable = document.querySelector('.datatables-users');
      const modal = document.querySelector('.dtr-bs-modal');

      if (userListTable && userListTable.classList.contains('collapsed')) {
        if (modal) {
          modal.addEventListener('click', function (event) {
            if (event.target.parentElement.classList.contains('delete-record')) {
              deleteRecord();
              const closeButton = modal.querySelector('.btn-close');
              if (closeButton) closeButton.click(); // Simulates a click on the close button
            }
          });
        }
      } else {
        const tableBody = userListTable?.querySelector('tbody');
        if (tableBody) {
          tableBody.addEventListener('click', function (event) {
            if (event.target.parentElement.classList.contains('delete-record')) {
              deleteRecord(event);
            }
          });
        }
      }
    }

    // Initial event binding
    bindDeleteEvent();

    // Re-bind events when modal is shown or hidden
    document.addEventListener('show.bs.modal', function (event) {
      if (event.target.classList.contains('dtr-bs-modal')) {
        bindDeleteEvent();
      }
    });

    document.addEventListener('hide.bs.modal', function (event) {
      if (event.target.classList.contains('dtr-bs-modal')) {
        bindDeleteEvent();
      }
    });
    // To remove default btn-secondary in export buttons
    $('.dt-buttons > .btn-group > button').removeClass('btn-secondary');
  }

 


});


