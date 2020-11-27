$(document).ready(function() {
     $('.form-check-input').on('change',function() {
        if($(this).is(':checked')) {
            console.log("il a check", $(this).parent().prev().val());
            $(this).parent().prev().val("on");
        } else {
            console.log("il a decheck", $(this).parent().prev().val());
            $(this).parent().prev().val("");
        }
    });


    $("#content").on("change", function () {
        const textInter = $(this).val().substring(0,124);
        $(this).val(textInter);
    })


    $("#terminer").click(function() {
        const buttons = $(this);
        buttons.hide();

        const url = '/medecin/updateMedecinForActivate', type = 'post';
                  $.ajax({
                      url,
                      type,
                      success: function(datas) {
                          if (datas.etat) {
                              $.notify({
                                  position: 3,
                                  type: 'success',
                                  duration: 10000,
                                  message: "Vous êtes actif maintenant dans le système."
                              });
  
                              
                          } else {
                              $.notify({
                                  position: 3,
                                  type: 'error',
                                  duration: 8000,
                                  message: datas.error
                              });
                              buttons.show();
                          }
                      }
                  });
                

    });


    $(".payeMedecin").click(function() {
        const id = $(this).attr('data-ref');
        const buttons = $(this);
        buttons.hide();

        const url = '/medecin/payeMedecin', type = 'post';
                  $.ajax({
                      url,
                      type,
                      data: {id},
                      success: function(datas) {
                          if (datas.etat) {
                              $.notify({
                                  position: 3,
                                  type: 'success',
                                  duration: 10000,
                                  message: "Payé avec succèss"
                              });
  
                              
                          } else {
                              $.notify({
                                  position: 3,
                                  type: 'error',
                                  duration: 8000,
                                  message: datas.error
                              });
                              buttons.show();
                          }
                      }
                  });
                

    });
})