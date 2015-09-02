/**
 * Created by Ekaterina.Porkhun on 08.04.2015.
 */

function replaceTotal() {
    var form = $('.orderform #order_form'), formWidth = form.width(),
        totalBlock = $('#order_total_block'), totalBlockClone = totalBlock.clone();
    if(formWidth == 430 && (!totalBlock.parent().hasClass('mobile-total-wrap'))) {
        console.log(totalBlock.parent().attr('class'));
        totalBlock.remove();
        form.find('.mobile-total-wrap').append(totalBlockClone);
    }
    else if(formWidth != 430 && totalBlock.parent().hasClass('mobile-total-wrap')) {
        console.log(totalBlock.parent().attr('class'));
            totalBlock.remove();
            form.find('.desktop-total-wrap').prepend(totalBlockClone);
    }

}
$(function(){
    replaceTotal();
    var clickTrigger = true;

   $('.order_title').click(function(){
       if(clickTrigger && $(window).width() < 970) {
           clickTrigger = false;
           var nextElement =  $(this).parent().parent().next().find('.block-content');
           $(this).toggleClass('opened');
           nextElement.animate({height: 'toggle'}, 1000, function(){
               clickTrigger = true;

           }).toggleClass('opened');
       }

   });
    $(window).resize(function(){
        replaceTotal();
       if($(window).width() > 970) {
           $('.orderform .block-content').removeAttr('style');
       }
    });
});