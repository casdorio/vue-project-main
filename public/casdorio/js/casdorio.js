'use strict';

$(function () {
    $('#selectUnits').change(function () {
        loadingSwal.show();
        var unitId = $(this).val();
        var currentUrl = window.location.href;
    
        var urlObj = new URL(currentUrl);
        var pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
        var unitIndex = pathSegments.indexOf('unit');
        if (unitIndex !== -1 && pathSegments[unitIndex + 1]) {
            pathSegments[unitIndex + 1] = unitId;
            
            // Verifica se há algo depois do ID e se for "no_unit", substitui por "dashboard"
            if (pathSegments[unitIndex + 2] === 'no_unit') {
                pathSegments[unitIndex + 2] = 'dashboard';
            }
        } else {
            pathSegments.unshift('unit', unitId, 'dashboard');
        }
    
        // Garante que "no_unit" seja removido caso esteja em qualquer posição após o ID
        pathSegments = pathSegments.filter((segment, index) => !(index > unitIndex + 1 && segment === 'no_unit'));
    
        urlObj.pathname = '/' + pathSegments.join('/');
        window.location.href = urlObj.toString();
    });   

    // Cria um objeto global 'loadingSwal' se não existir
    if (!window.loadingSwal) {
        window.loadingSwal = {};
    }

    // Função para exibir o SweetAlert de loading
    window.loadingSwal.show = () => {
        // Verifica se já há um Swal em execução e evita criar outro
        if (!window.loadingSwal.instance) {
            window.loadingSwal.instance = Swal.fire({
                title: 'Aguarde...',
                allowOutsideClick: false, // Impede fechar ao clicar fora
                showConfirmButton: false, // Remove o botão de confirmação
                didOpen: () => {
                    Swal.showLoading(); // Exibe o carregamento
                }
            });
        }
    };

    // Função para fechar o SweetAlert de loading
    window.loadingSwal.close = () => {
        if (window.loadingSwal.instance) {
            window.loadingSwal.instance.close(); // Fecha o SweetAlert
            window.loadingSwal.instance = null; // Limpa a instância
        }
    };

    // Função global para obter o CSRF token via AJAX
    window.getCsrfToken = (callback) =>  {
        $.ajax({
            url: '/api/v1/get_token',  // Endpoint que retorna o CSRF token
            method: 'GET',
            contentType: 'application/json',
            success: function (response) {
                if (response.token) {
                    // Passa o token para o callback
                    callback(response.token);
                } else {
                    console.error('Erro ao obter o token CSRF');
                }
            },
            error: function () {
                console.error('Erro ao acessar o endpoint de CSRF');
            }
        });
    }

    window.updateUnitInUrl = (unitId) => {
        var currentUrl = window.location.href;
        var urlObj = new URL(currentUrl);
        var pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
        var unitIndex = pathSegments.indexOf('unit');
        if (unitIndex !== -1 && pathSegments[unitIndex + 1]) {
            pathSegments[unitIndex + 1] = unitId; // Substitui o ID atual
    
            // Verifica se há algo depois do ID e se for "no_unit", substitui por "dashboard"
            if (pathSegments[unitIndex + 2] === 'no_unit') {
                pathSegments[unitIndex + 2] = 'dashboard';
            }
        } else {
            pathSegments.unshift('unit', unitId, 'dashboard'); // Caso não haja, adiciona unit, ID e dashboard
        }
    
        // Garante que "no_unit" seja removido caso esteja em qualquer posição após o ID
        pathSegments = pathSegments.filter((segment, index) => !(index > unitIndex + 1 && segment === 'no_unit'));
    
        urlObj.pathname = '/' + pathSegments.join('/');
        window.location.href = urlObj.toString();
    };   
    
});
