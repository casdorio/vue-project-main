$(function () {

    const showAlert = (icon, title, text, options = {}, callback = null, html = null) => {
        $('#loading').hide();
        return Swal.fire({
            icon: icon,
            title: title,
            text: text,
            html: html,
            showCloseButton: true,
            showConfirmButton: false,
            didOpen: () => {
                Swal.hideLoading();
            },
            ...options
        }).then((result) => {
            if (callback && typeof callback === 'function') {
                callback(result);
            }
            return result;
        });
    };

    $(document).ajaxError((event, jqxhr) => {
        $('#loading').hide();
        if (jqxhr.status === 401) {
            showAlert('error', 'Session Lost', 'Session lost. Redirecting to login page...', {
                timer: 5000,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false
            }).then(() => {
                window.location.href = '/login';
            });
        } else if (jqxhr.status === 404) {
            const message = `Error: ${jqxhr.status} - ${jqxhr.statusText}`;
            showAlert('error', 'Oops...', message);
        } else {
            const message = jqxhr.responseJSON?.message || jqxhr.responseJSON?.error || `Error: ${jqxhr.status} - ${jqxhr.statusText}`;

            showAlert('error', 'Oops...', message);
        }
    });

});
