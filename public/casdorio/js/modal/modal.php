<div class="modal fade" id="unitModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel3">Modal title</h5>
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
            <div class="col-md-8 d-flex">



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
          <span class="spinner-border me-1 d-none" role="status" aria-hidden="true"></span>
          Salvar
        </button>
      </div>
    </div>
  </div>
</div>