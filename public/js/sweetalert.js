function sweetalert(icon, title, type, buttonobject, action, parameter) {
    Swal.fire({
        icon: icon,
        title: title,
        content: type,
        buttons: buttonobject,
        className: 'my-validation-message',
        preConfirm: (value) => {
            if (!value) {
                swal.showValidationMessage(
                    '<i class="fa fa-info-circle"></i> The content cannot be empty'
                )
            }
        }
    });
}

function determination(value, action, parameter) {
    return new Promise(
        function (resolve) {
            if (!value) {
                sweetalert(icon, title, type, buttonobject, action, parameter);
                console.log(0);
                resolve;
            } else {
                action(parameter);
                console.log(1);
            }
        });
}
