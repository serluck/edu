OrderForm.languageStyle = {
	label : '',
	optionUS : 'I want a US write',
	optionUK : 'I want a UK writer',
	optionUS_M : 'English (US)',
	optionUK_M : 'English (UK)',
    activeClass: 'langstyle-active',
    typeLink: false,
    
    init: function()
    {
        var uk10 = $('#additional_204');

        if (uk10.length > 0)
        {
            OrderForm.languageStyle.field = uk10;
            OrderForm.languageStyle.optionUK = 'I want a UK writer';
        }
        else
        {
            OrderForm.languageStyle.field = $('#additional_142');
        }
        if ($('#row_order_category td.main_column').length > 0) {
            $('#row_order_category td.main_column').append($('#langstyle_container')).append($('#row_langstyle td.foreign_column #phone_order_hint'));
            $('#row_langstyle').hide();
        }
        else {
            $('#row_langstyle').show();            
        }
    },
    
	customizeStyleSelect: function()
	{
        if (OrderForm.isPreview) {
            return;
        }
        var usbutton, ukbutton;
        OrderForm.languageStyle.init();
        
		if($('#langstyle').length && OrderForm.languageStyle.field.length && !$('#uk_writer').length && !$('#us_writer').length)
		{           
			$('#lstyle_options').html('');
			$('#row_langstyle').children('td:first').html(OrderForm.languageStyle.label+$('#row_langstyle').children('td:first').html());
			if(OrderForm.languageStyle.field.attr('type')=='checkbox')
            {
                if (!OrderForm.languageStyle.typeLink)
                {
                    usbutton = '<input type="radio" name="lstyle" id="us_writer" '+ (OrderForm.languageStyle.field.attr('checked') ? '' : 'checked="checked"' ) +'><label for="us_writer">' + OrderForm.languageStyle.optionUS + '</label>';
                    ukbutton = '<input type="radio" name="lstyle" id="uk_writer" '+ (OrderForm.languageStyle.field.attr('checked') ? 'checked="checked"' : '' ) +' /><label for="uk_writer">' + OrderForm.languageStyle.optionUK + '</label>';
                }
                else 
                {
                    usbutton = '<a href="#" id="us_writer" '+ (OrderForm.languageStyle.field.attr('checked') ? '' : 'class="'+OrderForm.languageStyle.activeClass+'"')+'> ' +  OrderForm.languageStyle.optionUS_M + ' </a>';
                    ukbutton = '<a href="#" id="uk_writer" '+ (OrderForm.languageStyle.field.attr('checked') ? 'class="'+OrderForm.languageStyle.activeClass+'"' : '')+'> ' +  OrderForm.languageStyle.optionUK_M    + ' </a>';
                }
                radio_html = '<div id="lstyle_options"><span class="lstyle_option">' + usbutton + '</span><input type="checkbox" value="" name=""  class="reformed" id="uk_us_switcher"  '+ (OrderForm.languageStyle.field.attr('checked') ? 'checked="checked"' : '' ) +'/><span>' + OrderForm.languageStyle.optionUK + '</span>';
                radio_html_m = '<div id="lstyle_options"><span class="lstyle_option">' + usbutton + '</span><input type="checkbox" value="" name=""  class="reformed" id="uk_us_switcher" '+ (OrderForm.languageStyle.field.attr('checked') ? 'checked="checked"' : '' ) +'/><span>' + OrderForm.languageStyle.optionUK + '</span>';
                if (OrderForm.languageStyle.typeLink)
                {
                    radio_html += '&nbsp;/&nbsp';
                    radio_html_m += '&nbsp;/&nbsp';
                }
                radio_html += '<span class="lstyle_option">' + ukbutton + '</span></div>';
                if (!OrderForm.languageStyle.typeLink)
                {
                    radio_html_m += '<br />';                    
                }
                radio_html_m += '<span class="lstyle_option">' + ukbutton + '</span></div>';
                if (OrderForm.languageStyle.typeLink)
                {
                    radio_html_m += '<br/>(+10% to the order total for UK writer)';
                }
            }
                        
			OrderForm.languageStyle.stepEdit();
		}
	},
    setLabel: function(label_name)
    {
        if (label_name)
        {
            OrderForm.languageStyle.label = label_name;
        }
    },
	stepEdit : function()
	{
		if(OrderForm.languageStyle.field.attr('checked'))
		{
			$('#langstyle').children('[value=2]').attr('selected', true);
		}
        else if ($('#langstyle').children('[value=2]').attr('selected'))
        {
            $('#langstyle').children('[value=2]').attr('selected', true);
        }
		else
		{
			$('#langstyle').children('[value=1]').attr('selected', true);
		}
        if(!$('#row_langstyle').length)
        {
            $('#langstyle_container').html(radio_html_m);
        }else{
            $('#langstyle_container').html(radio_html);
        }
        
		OrderForm.languageStyle.bindEventsEdit();
	},

	bindEventsEdit: function()
	{
		$('#us_writer').click(function() {
            $(this).addClass(OrderForm.languageStyle.activeClass);
            $('#uk_writer').removeClass(OrderForm.languageStyle.activeClass);
			$('#langstyle').children('[value=1]').attr('selected', true);
			OrderForm.languageStyle.field.attr('checked', '').change();
            if (OrderForm.languageStyle.typeLink){
                return false;
            }
		})

		$('#uk_writer').click(function() {
            $(this).addClass(OrderForm.languageStyle.activeClass);
            $('#us_writer').removeClass(OrderForm.languageStyle.activeClass);
            $('#langstyle').children('[value=2]').attr('selected', true);
            OrderForm.languageStyle.field.attr('checked', 'checked').change();
            if (OrderForm.languageStyle.typeLink){
                return false;
            }
		});
        
        $('#uk_us_switcher').click(function() {
            if (OrderForm.languageStyle.field.attr('checked')) {
                $('#us_writer').click();
            } else {
                $('#uk_writer').click();
            }
        });
	}
};

OrderForm.afterSwitchForms.push(OrderForm.languageStyle.customizeStyleSelect);

$(document).ready(function(){
	OrderForm.languageStyle.customizeStyleSelect();
});