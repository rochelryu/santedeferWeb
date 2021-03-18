$(document).ready(function() {

    
    $('.form').find('input, textarea').on('keyup blur focus', function (e) {
    
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});


     $('.form-check-input').on('change',function() {
        if($(this).is(':checked')) {
            $(this).parent().prev().val("on");
        } else {
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

    $(".activateCompte").click(function() {
        const ref = $(this).attr('data-ref');
        const typeAction = 1;
        const buttons = $(this);
        buttons.hide();

        const url = '/admin/actionCompte', type = 'post';
                  $.ajax({
                      url,
                      type,
                      data: {ref, typeAction},
                      success: function(datas) {
                          if (datas.etat) {
                              $.notify({
                                  position: 3,
                                  type: 'success',
                                  duration: 10000,
                                  message: datas.result
                              });
  
                              buttons.parent().parent().hide();
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

    $(".deleteCompte").click(function() {
        const ref = $(this).attr('data-ref');
        const typeAction = 2;
        const buttons = $(this);
        buttons.hide();

        const url = '/admin/actionCompte', type = 'post';
                  $.ajax({
                      url,
                      type,
                      data: {ref, typeAction},
                      success: function(datas) {
                          if (datas.etat) {
                              $.notify({
                                  position: 3,
                                  type: 'success',
                                  duration: 10000,
                                  message: datas.result
                              });
  
                              buttons.parent().parent().hide();
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
    $("table").addClass( 'nowrap' ).DataTable({
    responsive: true,
    
    buttons: [
        'copy', 'excel', 'pdf'
    ],
    "language": {
            "lengthMenu": "Display _MENU_ records per page",
            "zeroRecords": "Nothing found - sorry",
            "info": "Showing page _PAGE_ of _PAGES_",
            "infoEmpty": "No records available",
            "infoFiltered": "(filtered from _MAX_ total records)"
        }
});
$(".app-main").imagePreviewer();
})