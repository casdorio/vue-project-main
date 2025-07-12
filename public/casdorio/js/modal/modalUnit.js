'use strict';

$(function () {
    initGlobalEvents();
});

function initGlobalEvents() {
    // Aqui você inicializa os eventos globais, que não dependem do modal
    $('.btn-add-unit').on('click', function (e) {
        loadingSwal.show();

        if (window.Helpers.isMobileDevice()){
        //  console.log('toggleCollapsed');
         window.Helpers.toggleCollapsed();
        }

        showModal();
        loadingSwal.close();
    });

    $('.btn-edit-unit').on('click', function (e) {
        loadingSwal.show();
        showModal();
        getUnitData(e.target.getAttribute('data-id'));
        
    });


    $('#loading').addClass('d-none');
    $('#no_loading').removeClass('d-none');
}

function initModalEvents() {
    $(document).on('change', '#upload', handleImageUpload);
    $(document).on('click', '.account-image-reset', resetImage);
}

function showModal() {
    
    // Adiciona o modal ao DOM
    $('body').append(createModal());

    // Inicializa o modal e exibe
    const modal = new bootstrap.Modal(document.getElementById('unitModal'));
    modal.show();
    //document.getElementById('unitModal').removeAttribute('aria-hidden');
    
    getCsrfToken(function(csrfToken) {
        $('#unitForm input[name="csrf_token_casdorio"]').val(csrfToken);
    });
    // Chama a função initModalEvents para registrar eventos específicos dentro do modal
    initModalEvents();
    addSaveEvent();

    // Remove o modal do DOM ao ser fechado
    $('#unitModal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        $(this).remove();
    });

    window.Helpers.initCustomOptionCheck();
}

function createModal() {
    return `
<div class="modal fade" id="unitModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel3">Cadastrar Unidade de Ensino</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="unitForm">
          <input type="hidden" name="csrf_token_casdorio" value="">
          <input type="hidden" name="id" value="">
          <div class="row mb-5 ">
            <div class="col-md-4 text-center">
              <img src="../../casdorio/img/default-logo.png" alt="user-avatar" class="rounded" height="100" width="100"
                id="uploadedAvatar">
              <div class="mt-2">
                <label for="upload" class="btn btn-primary btn-sm">
                  Upload nova foto
                  <input type="file" id="upload" name="upload" avatar="upload" class="d-none account-file-input"
                    accept="image/png, image/jpeg">
                </label>
                <button type="button" class="btn btn-secondary btn-sm account-image-reset">Resetar</button>
              </div>
              <p class="text-muted small mt-1">JPG, PNG, GIF. Máximo 800KB.</p>
            </div>
            <div class="col-md-8 d-flex gap-2">

                        <div class="col-md mb-md-0 mb-5">
                          <div class="form-check custom-option custom-option-icon">
                            <label class="form-check-label custom-option-content" for="customRadioIcon1">
                              <span class="custom-option-body">
                                <i class="icon-base bx bx-rocket"></i>
                                <span class="custom-option-title">Escola</span>
                                <small> Escola de ensino regular.</small>
                              </span>
                              <input
                                name="modality_id"
                                class="form-check-input"
                                type="radio"
                                value="1"
                                id="customRadioIcon1"
                                checked />
                            </label>
                          </div>
                        </div>
                        <div class="col-md mb-md-0 mb-5">
                          <div class="form-check custom-option custom-option-icon">
                            <label class="form-check-label custom-option-content" for="customRadioIcon2">
                              <span class="custom-option-body">
                                <i class="icon-base bx bx-user"></i>
                                <span class="custom-option-title"> Creche </span>
                                <small> Somente educação infantil creche. </small>
                              </span>
                              <input
                                name="modality_id"
                                class="form-check-input"
                                type="radio"
                                value="2"
                                id="customRadioIcon2" />
                            </label>
                          </div>
                        </div>
                        <div class="col-md">
                          <div class="form-check custom-option custom-option-icon">
                            <label class="form-check-label custom-option-content" for="customRadioIcon3">
                              <span class="custom-option-body">
                                <i class="icon-base bx bx-crown"></i>
                                <span class="custom-option-title"> Cursos </span>
                                <small>Curso de idiomas por exemplo.</small>
                              </span>
                              <input
                                name="modality_id"
                                class="form-check-input"
                                type="radio"
                                value="3"
                                id="customRadioIcon3" />
                            </label>
                          </div>
                        </div>

            </div>
          </div>
          <div class="row g-2">
            <div class="col-md-6 mb-3">
              <label for="full_name" class="form-label">Nome Completo</label>
              <input type="text" class="form-control" name="full_name" placeholder="Ex: Unidade Central dos Santos">
            </div>
            <div class="col-md-6 mb-3">
              <label for="short_name" class="form-label">Nome Curto</label>
              <input type="text" class="form-control" name="short_name" placeholder="Ex: UC Recreio">
            </div>
            <div class="col-md-6 mb-3">
              <label for="business_name" class="form-label">Nome Empresarial</label>
              <input type="text" class="form-control" name="business_name" placeholder="Ex: Unidade Central LTDA">
            </div>
            <div class="col-md-6 mb-3">
              <label for="number_registration" class="form-label">CNPJ</label>
              <input type="text" class="form-control" name="number_registration" placeholder="99.999.999/0001-99">
            </div>
            <div class="col-md-6 mb-3">
              <label for="dominio" class="form-label">Domínio/Site</label>
              <input type="text" class="form-control" name="dominio" placeholder="Ex: unidade.com.br">
            </div>
            <div class="col-md-6 mb-3">
              <label for="phone" class="form-label">Telefone</label>
              <input type="text" class="form-control" name="phone" placeholder="(99) 99999-9999">
            </div>
            <div class="col-md-6 mb-3">
              <label for="mail" class="form-label">E-mail</label>
              <input type="email" class="form-control" name="mail" placeholder="Ex: contato@unidade.com.br">
            </div>
            <div class="col-md-12 mb-3">
              <label for="address" class="form-label">Endereço</label>
              <input type="text" class="form-control" name="address" placeholder="Ex: Rua das Flores, 123, Centro">
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
          Cancelar
        </button>
        <button class="btn btn-primary saveChangesBtn" type="button" id="saveChangesBtn">
          Salvar
        </button>
      </div>
    </div>
  </div>
</div>
    `;
}

function handleImageUpload(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            $('#uploadedAvatar').attr('src', e.target.result);
            $('#uploadedAvatar').attr('data-base64', base64Image); // Armazena a imagem em Base64
        };
        reader.readAsDataURL(file);
    }
}

function resetImage() {
    $('#uploadedAvatar').attr('src', $('#uploadedAvatar').data('original-src'));
    $('#upload').val('');
}

function addSaveEvent() {
    $('.saveChangesBtn').off('click').on('click', function () {
        let form = $('#unitForm');

        
        let formData = {
            csrf_token_casdorio: form.find('input[name="csrf_token_casdorio"]').val(),
            id: form.find('input[name="id"]').val() || null, // Se for uma edição, terá um ID
            modality_id: form.find('input[name="modality_id"]:checked').val(),
            full_name: form.find('input[name="full_name"]').val(),
            short_name: form.find('input[name="short_name"]').val(),
            business_name: form.find('input[name="business_name"]').val(),
            number_registration: form.find('input[name="number_registration"]').val(),
            dominio: form.find('input[name="dominio"]').val(),
            phone: form.find('input[name="phone"]').val(),
            mail: form.find('input[name="mail"]').val(),
            address: form.find('input[name="address"]').val(),
            avatar: $('#uploadedAvatar').attr('data-base64') || null // Captura a imagem base64, se houver
        };

        let method = formData.id ? 'PUT' : 'POST'; // PUT para edição, POST para novo
        let url = formData.id ? `/api/v1/unit/${formData.id}` : '/api/v1/unit'; // Define a URL correta

        //console.log(form.find('input[name="modality_id"]:checked').val());

        $.ajax({
            url: url,
            type: method,
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
                console.log(response.data?.id??'');
                updateUnitInUrl(response.data.id);
            }
        });

        let modal = bootstrap.Modal.getInstance(document.getElementById('unitModal'));
        modal.hide();
        loadingSwal.show();
    });
}


function getUnitData(unitId){
    $.ajax({
        url: `/api/v1/unit/${unitId}`,
        type: 'get',
        contentType: 'application/json',
        success: function (response) {
            let unitData = response.data.unit;
            let form = $('#unitForm');

            console.log(unitData);
            form.find('input[name="id"]').val(unitData.id);
            form.find('input[name="full_name"]').val(unitData.full_name);
            form.find('input[name="short_name"]').val(unitData.short_name);
            form.find('input[name="business_name"]').val(unitData.business_name);
            form.find('input[name="number_registration"]').val(unitData.number_registration);
            form.find('input[name="dominio"]').val(unitData.dominio);
            form.find('input[name="phone"]').val(unitData.phone);
            form.find('input[name="mail"]').val(unitData.mail);
            form.find('input[name="address"]').val(unitData.address);
            form.find('input[name="modality_id"]').val(unitData.modality_id);
            if(unitData.avatar){
                $('#uploadedAvatar').attr('src', unitData.avatar);
                $('#uploadedAvatar').attr('data-base64', unitData.avatar);
            }

        },
        complete: function () {
           loadingSwal.close();
        }
    });

}
