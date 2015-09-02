Date.prototype.format=function(format){var returnStr='';var replace=Date.replaceChars;for(var i=0;i<format.length;i++){var curChar=format.charAt(i);if(replace[curChar]){returnStr+=replace[curChar].call(this);}else{returnStr+=curChar;}}return returnStr;};Date.replaceChars={shortMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],longMonths:['January','February','March','April','May','June','July','August','September','October','November','December'],shortDays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],longDays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],d:function(){return(this.getDate()<10?'0':'')+this.getDate();},D:function(){return Date.replaceChars.shortDays[this.getDay()];},j:function(){return this.getDate();},l:function(){return Date.replaceChars.longDays[this.getDay()];},N:function(){return this.getDay()+1;},S:function(){return(this.getDate()%10==1&&this.getDate()!=11?'st':(this.getDate()%10==2&&this.getDate()!=12?'nd':(this.getDate()%10==3&&this.getDate()!=13?'rd':'th')));},w:function(){return this.getDay();},z:function(){return"Not Yet Supported";},W:function(){return"Not Yet Supported";},F:function(){return Date.replaceChars.longMonths[this.getMonth()];},m:function(){return(this.getMonth()<9?'0':'')+(this.getMonth()+1);},M:function(){return Date.replaceChars.shortMonths[this.getMonth()];},n:function(){return this.getMonth()+1;},t:function(){return"Not Yet Supported";},L:function(){return(((this.getFullYear()%4==0)&&(this.getFullYear()%100!=0))||(this.getFullYear()%400==0))?'1':'0';},o:function(){return"Not Supported";},Y:function(){return this.getFullYear();},y:function(){return(''+this.getFullYear()).substr(2);},a:function(){return this.getHours()<12?'am':'pm';},A:function(){return this.getHours()<12?'AM':'PM';},B:function(){return"Not Yet Supported";},g:function(){return this.getHours()%12||12;},G:function(){return this.getHours();},h:function(){return((this.getHours()%12||12)<10?'0':'')+(this.getHours()%12||12);},H:function(){return(this.getHours()<10?'0':'')+this.getHours();},i:function(){return(this.getMinutes()<10?'0':'')+this.getMinutes();},s:function(){return(this.getSeconds()<10?'0':'')+this.getSeconds();},e:function(){return"Not Yet Supported";},I:function(){return"Not Supported";},O:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+'00';},P:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+':'+(Math.abs(this.getTimezoneOffset()%60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()%60));},T:function(){var m=this.getMonth();this.setMonth(0);var result=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,'$1');this.setMonth(m);return result;},Z:function(){return-this.getTimezoneOffset()*60;},c:function(){return this.format("Y-m-d")+"T"+this.format("H:i:sP");},r:function(){return this.toString();},U:function(){return this.getTime()/1000;}};

var OrderForm = {
	beforeSwitchForms : [],
	afterSwitchForms : [],
	afterShowFeaturePrice : [],

    beforeOnInputChange : [],
	afterOnInputChange : [],

	beforeFormInit : [],
    afterFormInit : [],
    
    beforeOnCalculatePrice: [],
    afterOnCalculatePrice: [], 
    
    beforeValidate: [],
    
    afterOnValidateRespond: [],
    
    fn: {},
    
	order_features : {},

	step : 0,
	values : {preff_wr_id : 0},
	prices : {},
	limits : {},
	price_groups : {},
	loaded : {},
	form_valid : 0,
	tzOffset : 0,
	max_preferred_writers : 10,
	validateFields : ['firstname', 'lastname', 'name', 'retype_email', 'email', 'country', 'phone1', 'phone1_type', 'phone1_country', 'phone1_area', 'phone1_number', 'phone2', 'phone2_type', 'phone2_country', 'phone2_area', 'phone2_number', 'topic', 'numpages', 'order_category', 'order_category_sphere', 'details',/* 'accept',*/ 'deadline' /* with hack in validate function */, 'password', 'urgency', 'wrlevel'],
	validateEachField : [],
	validateArrayFields : ['preff_wr_id'],
	coverLetterId : 0,
	withCoverLetterIds : {},
	isPreview : false,
	isResubmit : false,
    isProofreadGrammarbase : false,
	isQuote : false,
	isCalculator : false,
	isEdit : false,
    isInit : false,
    isResumes : false,
    isPaypal : false,
    isTranslation : false,
    isMobileResumes : false,
	cppDiscountRules : {},
    generalDiscount : 0,
	currenciesFormat : {},
    $order_category_options : null,
	$pages_options : [],
	orderDate : false,
	orderCode : '',
	adminAuthorized : false,
    previewName : '',
	validateAction : '',
    showAcceptError : false,
    sp_validation: 0,
    was_proceed: 0, 
    switch_to_phone: true,
    switch_to_row_after_error: false,
    linearSelectDelimiter: false,
    linear_options: {
	    /** @param jQuery|bool jQuery object */
	    entry: $('<a href="#"/>'),
	    /** @param jQuery|bool jQuery object */
	    container: $('<span class="linear-select"/>'),
	    /** @param jQuery|bool jQuery object */
	    wrap_entry: false,
	    /** @param jQuery|bool jQuery object */
	    wrap_title: false
    },
    tempDescountData: null,
    secondStepImage : '',
    numpages_append_words: true,
    callSubmitFromSubmitValidatedForm : false,
    
    onAfterAddPreferredWriterInput: function(){},
	onAfterRemovePrefWriter: function(){},
    
	initialize : function()
	{
        for (var ind in OrderForm.beforeFormInit)
		{
			OrderForm.beforeFormInit[ind].call(OrderForm, this);
		}
        
		$.cluetip.setup({insertionType: 'insertBefore', insertionElement: 'body div:first', showTitle: false});
		OrderForm.calculateTZOffset();
		OrderForm.afterSwitchForms.push(OrderForm.updateLinearSelects);
		$('#order_form').find('select,input,textarea').each(function(){OrderForm.saveValue(this);});
		if ($('#doctype').length > 0 )
		{
			cur_dt = OrderForm.getDoctypeValue();

			if (cur_dt != OrderForm.doctype) {
				OrderForm.doctype = cur_dt;
				OrderForm.onDoctypeChange();
			} else {
				OrderForm.calculatePrice();
			}
		}

		OrderForm.loaded[OrderForm.doctype] = $('#order_details').html();
		OrderForm.max_preferred_writers = $('#preff_wr_id_max').val();
		OrderForm.fillNumpages();
		OrderForm.showHidePages();
		OrderForm.updateLinearSelects();
		OrderForm.setInputEvents();
		$('#email').change(OrderForm.onInputChange);

//		$('#preff_wr_id .add').click(OrderForm.addPreferredWriterInput);
//		$('#preff_wr_id .delete').click(OrderForm.removePrefWriter);

        $('#need_access_to_online_account').live('change', function(){
            if($(this).is(':checked'))
            {
                $('#row_online_account_login, #row_online_account_password').show();
            }
            else
            {
                $('#row_online_account_login, #row_online_account_password').hide();
            }
        });

        if ($('#email').val() == '')
        {
            OrderForm.hidePassword();
        }
        else
        {
        	if (!OrderForm.isResubmit)
        	{
            	OrderForm.checkPassword();
           	}
        }
        OrderForm.attachBubblePopup();

		this.enableHints();
		OrderForm.showHidePreferredInputs();

		if ($('#doctype').length > 0 && !OrderForm.isResumes) OrderForm.preload.call(OrderForm);

        for (field in OrderForm.validateFields) {
            $('#' + OrderForm.validateFields[field]).change(OrderForm.onInputChangeClearValidationError);
        }

		if (OrderForm.authorized) {
			OrderForm.ping();
		}

		OrderForm.enableSubmit();

        OrderForm.initOrderCategories();

		OrderForm.repaintTable();
		if ($('#doctype').length > 0) {
			OrderForm.pickOutFreeFeatures();
		}
		OrderForm.onInputChangeClearValidationError = function(input) {
			if (input)
			{
                $row = $('#row_' + input.id)
                if ($row.length == 0) $row = $(input).parents('tr:first');
				$row.removeClass('validation-error');
			}
			$(input).removeClass('validation_error');
		    $(input).parent().find('div.validation_error').hide();

            OrderForm.insertValInOtherObject(input);

            if ($('#input_phone_country_code1').length > 0 && $(input).attr("id") == 'country')
            {                
                for (ind in OrderForm.country)
                {
                    if(OrderForm.country[ind]['id_country'] == $(input).val())
                    {
                        var code = OrderForm.country[ind]['c_id'].replace("*"," ");                        
                        $('#input_phone_country_code1').val(code);
                        $('#input_phone_country_code2').val(code);
                        break;
                    }
                }
            }

            $div = $('div.eot');
            if ($div.length) {
                $(input).css("background-color","#FFFFFF");                

                if (($(input).attr("id") == 'email') || ($(input).attr("id") == 'retype_email'))
                {
                    if($('#email').val() == $('#retype_email').val())
                    {
                       $('#email').css("background-color", "#ccff99");
                       $('#retype_email').css("background-color", "#ccff99");
                    }
                }
            }
		}

		OrderForm.checkPromoCode();

        if(window.Features != undefined)
        {
            this.order_features = Features.initialize();
        }

		if ($.browser.msie) {
			OrderForm.validationName = 'Validating...';
		}

        OrderForm.notEnterSubmit();
        OrderForm.isInit = true;
        for (var ind in OrderForm.afterFormInit)
		{
			OrderForm.afterFormInit[ind].call(OrderForm, this);
		}
    },
    validateTextareaMaxlength : function ()
    {
        var el = $(this);
        if (el.val().length > parseInt(el.attr('maxlength')))
        {
            el.val(el.val().substring(0, el.attr('maxlength')));
        }
    },
    loadEachFieldValidate : function (){
        $.each(OrderForm.validateEachField, function(number, field){
            OrderForm.validate(OrderForm.onValidateField($('#'+field)));
        });
    },
    notEnterSubmit : function () {
            $('#order_form input[type!=submit]').keypress(function(e){
                if(e.which == 13){
                    return false;
                }
            });
        },

    insertValInOtherObject: function(inputObj)
    {
        if($(inputObj).attr("insertto"))
        {
            insertVal = $(inputObj).val();
            if ($(inputObj).attr("id") == 'country')
            {
                for (ind in OrderForm.country)
                {
                    if(OrderForm.country[ind]['id_country'] == insertVal){
                        insertVal = OrderForm.country[ind]['c_id'].replace("*"," ");
                        break;
                    }
                }
            }
            insertObjId = $(inputObj).attr("insertto").split(" ");    
            for(ind in insertObjId)
            {
                if ($('#'+insertObjId[ind]).length > 0 && $('#'+insertObjId[ind]).is(':visible'))
                {
                    var elm = $('#'+insertObjId[ind]);
                    elm.val(insertVal);
                    OrderForm.saveValue(elm.get(0));
                }
            }
        }
    },
	ping : function() {
		window.setTimeout(function() {$.get('/order.ping?' + Math.random(), {}, OrderForm.ping)}, 60000);
	},

    initOrderCategories : function() {
        if ($('#order_category_sphere').length)
        {
            selected_category = $('#order_category').val();
            $options = $('#order_category option');
            var categories = {};
            category = 0;
            for (i = 1; i < $options.length; i++)
            {
                if ($options[i].text.charCodeAt(0) == 160)
                {
                    $options[i].text = $options[i].text.substr(2);
                }
                else
                {
                    $options[i].text = '#' + $options[i].text;
                    category = i;
                }
                if (category)
                {
                    categories[i] = category;
                }
            }

            OrderForm.$order_category_options =  new $('#order_category option');

            OrderForm.categorySphereChange();

            $('#order_category option').each(
                function(){
                    if (this.value == selected_category)
                    {
                        $(this).parent()[0].selectedIndex = this.index;
                    }
                }
            );

            $('#order_category_sphere').change(OrderForm.categorySphereChange);
        }
    },

    categorySphereChange : function() {
        var category_sphere = $('#order_category_sphere').val();
        var $row_order_category = $('#row_order_category');
        var $order_category = $('#order_category');
        $order_category.empty();
        $order_category.append($options[0]);
        if (category_sphere == 0)
        {
            $('#order_category option[value=' + category_sphere + ']').attr('selected', 'selected');
            $row_order_category.hide();
        }
        else
        {
            $options = OrderForm.$order_category_options;
            if ($options.length)
            {
                var spheres = false;

                for (i = 1; i < $options.length && $options[i - 1].value != category_sphere; i++) {}
                for (; i < $options.length && $options[i].text.indexOf('#') == -1; i++)
                {
                    $order_category.append($options[i]);
                    spheres = true;
                }

                if (!spheres)
                {
                    for (i = 1; i < $options.length && $options[i].value != category_sphere; i++) {}
                    $order_category.append($options[i]);
                    $('#order_category option[value=' + category_sphere + ']').attr('selected', 'selected');
                    $row_order_category.hide();
                }
                else
                {
                    $('#order_category option[value=0]').attr('selected', 'selected');
                    $row_order_category.show();
                }
            }
        }
        OrderForm.repaintTable();
    },
    
    clueTipOpts : {
        topOffset: -12,
        leftOffset: -15,
        arrows: true,
        dropShadow: $.browser.msie ? true : false,
        fx: {
            open:       'fadeIn', // can be 'show' or 'slideDown' or 'fadeIn'
            openSpeed:  100
        },
        hoverIntent: {
            sensitivity:  5,
            interval:     400,
            timeout:      0
        },

        sticky: true,
        mouseOutClose: true,
        closePosition: 'title',
        closeText: '',
        splitTitle: '|',
        showTitle: false,
        height: 'auto',
        width: 'auto'
    },
            
    clueTipOptsSsl : {
        topOffset: -50,
        leftOffset: -63,
        arrows: true,
        dropShadow: $.browser.msie ? true : false,
        fx: {
            open:       'fadeIn', // can be 'show' or 'slideDown' or 'fadeIn'
            openSpeed:  100
        },
        hoverIntent: {
            sensitivity:  5,
            interval:     400,
            timeout:      0
        },

        sticky: true,
        mouseOutClose: true,
        closePosition: 'title',
        closeText: '',
        splitTitle: '|',
        showTitle: false,
        height: 'auto',
        width: 'auto'        
    },
    
	enableHints : function($els) {
		if ($els == undefined)
		{
			$els = $('a.field_hint');
		}
        $els.each(function(){
            if ($(this).hasClass('ssl'))
            {
                $(this).cluetip(OrderForm.clueTipOptsSsl);
            }            
            else
            {
                $(this).cluetip(OrderForm.clueTipOpts);
            }
		});
	},

	priceError : function(d, w, u) {
		return;
		$.post('/order.error/', {'d': d, 'u': u, 'w': w, 'url' : window.location}, function(data) {
			if (data!='') {
				alert('oops!');
			}
		}
		)
	},
	setFormValues : function () {
		for (item_id in this.values) {
			if (item_id == 'doctype') {
				this.setDoctypeValue(this.doctype);
                this.saveValue($('#doctype')[0]);
			} else
			if (item_id == 'preff_wr_id') {
				values = this.values.preff_wr_id;
				pref_cnt = 0;
				for (i = 0; i < values.length; i++) {
					if (values[i].value != '') pref_cnt++;
				}
				pref_cnt = pref_cnt > 0 ? pref_cnt : 1;
				$preff_wr_id_inputs = $('#preff_wr_id input');
				for (i = $preff_wr_id_inputs.length; i < pref_cnt; i++)
				{
					this.addPreferredWriterInput();
				}

				$preff_wr_id_inputs = $('#preff_wr_id input');

				for (i = 0; i < values.length; i++) {
					if ($preff_wr_id_inputs[i]) {
						$preff_wr_id_inputs[i].value = values[i];
					}
				}

			} else
			if (item_id != '') {
				$element = $('#' + item_id);
				if ($element.length > 0) {
					tagName = $element[0].tagName;
					if (tagName == 'INPUT' || tagName == 'TEXTAREA') {
						if ($element[0].type == 'checkbox') 
                        {
                            if(item_id == 'need_access_to_online_account')
                            {
                                if(!$element[0].checked)
                                {
                                    $element[0].checked = this.values[item_id].checked;
                                }
                                else
                                {
                                    this.values[item_id].checked = $element[0].checked;
                                }
                                $($element[0]).change();
                            }
                            else
                            {
                                $element[0].checked = this.values[item_id].checked;
                            }
						} else {
							$element.val(this.values[item_id].value);
						}
					} else
					if (tagName == 'SELECT' ) {
						if (item_id != 'urgency' || OrderForm.isResubmit) {
							for (i = 0; i < $element[0].length; i++) {
								if ($element[0].options[i].text == this.values[item_id].text ||
									item_id == 'order_category' && $element[0].options[i].text.charCodeAt(0) == 160 && $element[0].options[i].text.substr(2) == this.values[item_id].text) {
									$($element[0].options[i]).attr('selected', 'selected');
									break;
								}
							}
						}
						this.saveValue($element[0]);
					}
				}
				else
				if (item_id == 'o_interval')
                {
                    this.values[item_id].value = 0;
                }
				else
				if (item_id != 'email' && item_id != 'order_category')
				{
					delete this.values[item_id];
				}
			}
		}
        if ($('#numpapers').length == 0 && this.values.numpapers)
        {
            this.values.numpapers.value = 1;
        }
	},
	calculatePrice : function () {
		if ($('#doctype').length == 0) return;
        
        for (ind in OrderForm.beforeOnCalculatePrice)
		{
			OrderForm.beforeOnCalculatePrice[ind].call(OrderForm, this);
		} 
        
		params = OrderForm.getSelectedParams();
        value = OrderForm.calcPriceForDoctype(params);
        
        if (!value) {
            window.setTimeout(OrderForm.calculatePrice, 2000);
        }

        if (OrderForm.primeSupport) {
            if (!OrderForm.primeSupport.instance) {
                OrderForm.primeSupport.init();
            }
        }
        
		if (this.isPreview)
		{
			$('#value_cost_per_page').html(OrderForm.formatCurrency(value.cost_per_page, OrderForm.values.curr.value));
			$('#value_total_without_discount').html(OrderForm.formatCurrency(value.total_without_discount, OrderForm.values.curr.value));
			$('#value_discount').html(OrderForm.formatCurrency(value.discount, OrderForm.values.curr.value));
			this.setDiscountValue(value);
			$('#value_total').html(OrderForm.formatCurrency(value.total_with_discount, OrderForm.values.curr.value));
                        
            var prev_value = $('#order_total_block .previous_value').html();
            if (prev_value) {
                prev_value = prev_value.replace('(', '');
                prev_value = prev_value.replace(')', '');
                prev_value = parseFloat(prev_value);
                if (prev_value == value.total_with_discount) $('#order_total_block .previous_value').hide();
            }
		}
		else
		{
            if ($('#cost_per_page').length && $('#cost_per_page')[0].tagName != 'INPUT')
            {
                $('#cost_per_page').html(OrderForm.formatCurrency(value.cost_per_page, OrderForm.values.curr.value));
            }
			$('#total_without_discount').html(OrderForm.formatCurrency(value.total_without_discount, OrderForm.values.curr.value));
			OrderForm.setDiscountValue(value);
            if ($('#total').length > 0)
            {
                if ($('#total')[0].tagName != 'INPUT')
                {
                   $('#total').html(OrderForm.formatCurrency(value.total_with_discount, OrderForm.values.curr.value));
                }
            }

            if ($('#doctype')[0].tagName != 'SELECT' && !OrderForm.isPreview || OrderForm.isMobileResumes) 
            {
                $('.doctype_radiolist .name').css('width', '80%');
                for (d_id in this.prices) 
                {
                    if (OrderForm.tempDescountData != null)
                    {
                        OrderForm.discountCodeType = OrderForm.tempDescountData.coefficient_type;
                        OrderForm.discountCodeCoefficient = OrderForm.tempDescountData.coefficient[d_id];
                        if (OrderForm.discountCodeCoefficient == undefined)
                        {
                            OrderForm.discountCodeCoefficient = 0;
                        }
                    }
                    else
                    {
                        OrderForm.discountCodeType = 0;
                        OrderForm.discountCodeCoefficient = 0;
                    }

                    params.doctype_id = d_id;
                    res = this.calcCostPerPageForDoctype(params);

                    if (d_id == this.getDoctypeValue())
                    {
                        value = this.calcPriceForDoctype(params);
                        var current_doctype_id = params.doctype_id;

                        if (this.withCoverLetterIds[params.doctype_id]) 
                        {
                            var current_total_without_feature = value.total_without_feature;
                            cl_price = parseFloat(params.currencyRate) * 23 * Math.max(this.values.cover_letters ? this.values.cover_letters.value - 1: 0, 0);
                            value.total = parseFloat(value.total) + cl_price;
                            value.total_with_discount = (parseFloat(value.total_with_discount) + cl_price).toFixed(2);
                            value.total_without_discount = (parseFloat(this.total_without_discount) + cl_price).toFixed(2);
                            current_total_without_feature = (parseFloat(current_total_without_feature) + cl_price + parseFloat(value.discount)).toFixed(2);
                            var current_row = $('#label_doctype_'+params.doctype_id);
                            res.cost_per_page_without_discount = (res.cost_per_page_without_discount + cl_price).toFixed(2);
                        }
                        this.setDiscountValue(value);
                        if ($('#total')[0].tagName != 'INPUT')
                        {
                            $('#total').html(OrderForm.formatCurrency(value.total_with_discount, OrderForm.values.curr.value));
                        }
                    }
                    
                    var originalPrice = res.cost_per_page_without_discount;
                    
                    if (OrderForm.discountCodeCoefficient != 0 && originalPrice >= params.currencyRate * 30)
                    {
                        if (OrderForm.discountCodeType == 0)
                        {
                            var discountedPrice = Math.round((1 - OrderForm.discountCodeCoefficient) * res.cost_per_page_without_discount * 100) / 100;
                        }
                        else if (OrderForm.discountCodeType == 1)
                        {
                            var discountedPrice = (res.cost_per_page_without_discount - OrderForm.discountCodeCoefficient).toFixed(2);
                        }

                        $('#label_doctype_' + d_id).html('<div class="discountedPrice">' + OrderForm.formatCurrency(discountedPrice, OrderForm.values.curr.value) + " </div><div class='originalPrice'>" + OrderForm.formatCurrency(originalPrice, OrderForm.values.curr.value) + '</div>');
                        $('.doctype_radiolist .name').css('width', '75%');
                    }
                    else
                    {
                        $('#label_doctype_' + d_id).html(OrderForm.formatCurrency(res.cost_per_page_without_discount, OrderForm.values.curr.value));
                    }

                }
                OrderForm.discountCodeType = 0;
                OrderForm.discountCodeCoefficient = 0;
			}
		}

        if (OrderForm.withCoverLetterIds[current_doctype_id] && OrderForm.isResumes) 
        {
            if (OrderForm.tempDescountData == null || OrderForm.tempDescountData.coefficient[current_doctype_id] == undefined)
            {
                current_row.html(OrderForm.formatCurrency(current_total_without_feature, OrderForm.values.curr.value));
            }
        }
        
		if (value.discount > 0) {
			this.showDiscount();
		} else {
			OrderForm.hideDiscount();
		}
        
        for (ind in OrderForm.afterOnCalculatePrice)
		{
			OrderForm.afterOnCalculatePrice[ind].call(OrderForm, this);
		}        
	},
	showHidePreferredInputs : function() {

		$preff_wr_id = $('#preff_wr_id');

		if ($preff_wr_id.length > 0)
		{
            $('#preff_wr_id .add').click(OrderForm.addPreferredWriterInput);
            $('#preff_wr_id .delete').click(OrderForm.removePrefWriter);
            //$preff_wr_id.find('.add').click(OrderForm.addPreferredWriterInput);
            //$preff_wr_id.find('.delete').click(OrderForm.removePrefWriter);
        }

		if (OrderForm.version1)
		{
			//return;
		}

		if ($preff_wr_id.length > 0 && $('#prefwriter_urgency_attention').length > 0)
		{
			if (OrderForm.getSelectedHours() > 48)
			{
                $('#prefwriter_urgency_attention').hide();
				//$preff_wr_id.parent().parent().show();
			}
			else
			{
                $('#prefwriter_urgency_attention').show();
				//$preff_wr_id.parent().parent().hide();
			}
		}
	},

	setInputEvents : function () {
		$('#order_form').find('select,input,textarea').unbind('change').change(this.onInputChange);
		if(-[1,]) ;else { //IE            
			$('#order_form').find('input[type=checkbox],input[type=radio]').unbind('click').click(this.onInputChange);
		}

        if (!$.browser.mozilla && !OrderForm.isResumes)
        {
            $('#order_form').find('input,textarea').bind('focus', function() {
                this.originalvalue=this.value;
            });
            $('#order_form').find('input,textarea').bind('blur', function() {
                if (this.value != this.originalvalue)
                {
                    $(this).change();
                }
            });
        }

		$('#extend_days,#extend_hours').change(OrderForm.deadlineExtendChange);

		if (this.isResubmit && !this.isPreview)
		{
			$('#urgency').change(OrderForm.deadlineExtendByUrgencyChange);
		}
        $('textarea[maxlength]').bind('keyup', OrderForm.validateTextareaMaxlength);
	},
    
    skipSwitchForms: function() {
        var cover_letters = $('#cover_letters_holder');
        var doc = $('#doctype_' + OrderForm.new_form_id).parent().parent().find('td.cover_letters label');
        $('#cover_letters').val(1);
        
        if (doc.length) {
            cover_letters.show();
            doc.after(cover_letters);
        } else {
            cover_letters.hide();
        }
        OrderForm.updateWrLevels(OrderForm.new_form_id);
        OrderForm.new_form_id = undefined;
        this.setFormValues();
        this.pickOutFreeFeatures();
        this.calculatePrice();
        $('#cover_letters').change(OrderForm.onInputChange);
    },
    
    updateWrLevels: function(doctype_id){
        if (OrderForm.isResumes && OrderForm.wrLevels && doctype_id && OrderForm.wrLevels[doctype_id])
        {
            OrderForm.updateInputptions($("#wrlevel"), OrderForm.wrLevels[doctype_id]);            
        }
    },
    
    updateInputptions: function(elm, options)
    {
        var html = "";
        if (elm && elm.length && options){
            $.each(options, function(k,v){
                html += "<option value=\"" + k + "\">" + v + "</option>";
            });            
            if (html){
                if (elm.is("select")){
                    elm.html(html);
                }                    
            }
        }        
    },

	switchForms : function (new_form_id) {
        OrderForm.new_form_id = new_form_id;
        for (ind in OrderForm.beforeSwitchForms)
		{
			OrderForm.beforeSwitchForms[ind].call(OrderForm, OrderForm.new_form_id);
		}
        
        if (OrderForm.new_form_id != undefined) {
            $order_details = $('#order_details');
            $order_details.find('[id]').each(function() {this.id += '_old';});
            $order_details[0].id += '_old';

            $order_details.after('<tbody id="order_details" style="display: none"/>');
            $('#order_details').html(this.loaded[OrderForm.new_form_id]);


            this.setFormValues();
            this.showHidePreferredInputs();
            this.pickOutFreeFeatures();
            this.calculatePrice();
            this.setInputEvents();
            this.fillNumpages();
            this.showHidePages();
            this.enableHints();
            this.initOrderCategories();

            $order_details.remove();
            document.getElementById('order_details').style.display = '';
            if ($('[name=accept]') && $('[name=accept]').length > 0 && $('[name=accept]')[0].checked == true)
            {
                $('[name=accept]')[0].checked = false;
                $('[name=accept]')[0].checked = true;
            }

            this.repaintTable();
            this.enableSubmit();

            if (this.isResubmit && !this.isPreview)
            {
                OrderForm.deadlineExtendByUrgencyChange();
                OrderForm.deadlineExtendChange();
                OrderForm.checkPromoCode();
            }
        }

		for (ind in OrderForm.afterSwitchForms)
		{
			OrderForm.afterSwitchForms[ind].call(OrderForm);
		}
        OrderForm.notEnterSubmit();
	},

	checkPromoCode : function () {
        var promoElm = $("#promo");
		promoCode = promoElm.val().replace(/^\s\s*/, '').replace(/\s\s*$/, '').toLowerCase();
		email_value = OrderForm.values.email ? OrderForm.values.email.value : '';
        if (OrderForm.isResumes || !email_value)
        {
            email_value = null;
        }
		if ( promoCode != '' && !promoElm.hasClass("default-hint"))
		{
			numpages = OrderForm.values.numpages ? numpages = OrderForm.values.numpages.value : 1;
			var doctype = this.getDoctypeValue();
			wrlevel = this.getWrlevelValue();
			urgency = this.getUrgencyValue();

			if (this.isResubmit && !this.isPreview && OrderForm.adminAuthorized)
			{
				loc = location.href;
				loc = loc.substring(0, loc.indexOf('resubmit') - 1);
			}
			else
			{
				loc = '/order';
			}

			loc = loc + '.check-promo-code/' + encodeURIComponent(email_value) + '/' + encodeURIComponent(promoCode) + '/' + encodeURIComponent(numpages) + '/' + encodeURIComponent(doctype) + '/' + encodeURIComponent(wrlevel) + '/' + encodeURIComponent(urgency);
			if (this.isResubmit && OrderForm.orderCode != '')
			{
				loc =loc + '/' + OrderForm.orderCode;
			}
            else
            {
                loc =loc + '/null';
            }

            var get_doctypes = OrderForm.showOriginalPrice ? 1 : 0;
            if (get_doctypes) 
            {
                loc = loc + '/' + encodeURIComponent(get_doctypes)    
            }

            if (!this.isResubmit)
            {
                $.getJSON(
                    loc,
                    {},
                    OrderForm.onCheckPromoCode
                );
            }

		} else {
            if (this.isResumes)
            {
                OrderForm.onCheckPromoCode();
            }
			OrderForm.discountCodeCoefficient = 0;
			OrderForm.discountCodeType = 0;
			OrderForm.calculatePrice();
		}
	},

	onCheckPromoCode : function (data) {
        if(!OrderForm.isResumes && !OrderForm.isMobileResumes)
        {
            OrderForm.discountCodeCoefficient = data.coefficient;
            OrderForm.discountCodeType = data.coefficient_type;
        }
        else
        {
            OrderForm.tempDescountData = data
        }
        OrderForm.calculatePrice();
	},

	getDoctypeValue : function () {
		result = undefined;
		$doctype =  $('#doctype');
		if ($doctype.length > 0)
		{
			if ($doctype[0].tagName == 'INPUT' || $doctype[0].tagName == 'SELECT')
			{
				result = $doctype.val();
			}
			else
			{
				result = $doctype.find('input:checked').val();
			}
		}
		return result;
	},

	getWrlevelValue : function () {
		result = undefined;
		$wrlevel =  $('#wrlevel');
		if ($wrlevel.length > 0)
		{
			if ($wrlevel[0].tagName == 'INPUT' || $wrlevel[0].tagName == 'SELECT')
			{
				result = $wrlevel.val();
			}
			else
			{
				result = $wrlevel.find('input:checked').val();
			}
		}
		return result;
	},

	getUrgencyValue : function () {
		result = undefined;
		$urgency =  $('#urgency');
		if ($urgency.length > 0)
		{
			if ($urgency[0].tagName == 'INPUT' || $urgency[0].tagName == 'SELECT')
			{
				result = $urgency.val();
			}
			else
			{
				result = $urgency.find('input:checked').val();
			}
		}
		return result;
	},

	setDoctypeValue : function (value) {
		$doctype =  $('#doctype');
		if ($doctype[0].tagName == 'INPUT' || $doctype[0].tagName == 'SELECT') {
			$doctype.val(value);
		} else {
			$('#doctype_' + value).attr('checked', 'checked');
		}
	},

	saveValue : function(element) {

		if (element.name == 'preff_wr_id[]')
		{
			this.values.preff_wr_id = new Array();
			$('#preff_wr_id input').each(function(){OrderForm.values.preff_wr_id[OrderForm.values.preff_wr_id.length] = this.value;});
		} else
		if (element.tagName == 'SELECT'){
			var elementId = element.id;
			var elementObj = $( '#'+elementId );
            if (element.selectedIndex == -1)
            {
                element.selectedIndex = 0;
            }

			if ( elementObj.attr( 'multiple' ) )
			{
				var values = elementObj.val();
				OrderForm.values[element.id] = {};
				for(var key in values) {
					OrderForm.values[element.id][key] = {value: values[key], text: element.options[key].text, checked : ''};
				}
			} else {
				OrderForm.values[element.id] = {value: element.value, text: element.options[element.selectedIndex].text, checked : ''};
			}
		} else
		if (element.type == 'checkbox' ) {
			OrderForm.values[element.id] = {value: element.value, text: '', checked : element.checked};
		} else {
			OrderForm.values[element.id] = {value: element.value, text: '', checked : ''};
		}
	},

    calcTechPrices : function(d, w, u, c, price) {
        var tech_doctype = true,
            tech_category = false,
            intricate_category = false;
        for (i in this.nonTechDoctypes)
        {
            if (this.nonTechDoctypes[i] == d)
            {
                tech_doctype = false;
                break;
            }
        }
        for (i in this.techCategories)
        {
            if (this.techCategories[i] == c)
            {
                tech_category = true;
                break;
            }
        }

        for (i in this.intricateCategories)
        {
            if (this.intricateCategories[i] == c)
            {
                intricate_category = true;
                break;
            }
        }
        
        if (tech_doctype && tech_category)
        {
            price += 10;
        }
        
        if (tech_doctype && intricate_category)
        {
            price += 3;
        }
        
        if (c && OrderForm.categoriesPriceChange && tech_doctype)
        {
            c = parseInt(c);

            if (OrderForm.categoriesPriceChange[c])
            {
                price += OrderForm.categoriesPriceChange[c];
            }
        }
        
        return price;
    },

	calcCostPerPageForDoctype : function(params) {
		this.d = params.doctype_id;
		this.u = params.urgency_id;
		this.w = params.wrlevel_id;
        this.c = params.category_id;

		result = {};

		result.cost_per_page_without_discount = 0.0;

		try {
			if (!OrderForm.prices[this.d][this.w][this.u]) a = a.a;
			for (i in OrderForm.prices[this.d][this.w][this.u])
			{
                if (!isNaN(parseFloat(OrderForm.prices[this.d][this.w][this.u][i]) ))
                {
                    result.cost_per_page_without_discount = Math.max(
                        parseFloat(OrderForm.prices[this.d][this.w][this.u][i]),
                        result.cost_per_page_without_discount);
                }
			}
		}
		catch (e) {
			OrderForm.priceError(this.d, this.w, this.u);
			//console.log('No prices: d: ' + this.d + ', w: ' + this.w + ', u: ' + this.u);
		}

        result.cost_per_page_without_discount = this.calcTechPrices(this.d, this.w, this.u, this.c, result.cost_per_page_without_discount);

		result.cost_per_page_without_discount *= (params.currencyRate * (params.interval > 0 ? 2 : 1));

		result.cost_per_page_without_discount = Math.round(result.cost_per_page_without_discount * 100) / 100;

		return result;
	},

	repaintTable : function() {
		$trs = $('#order_form table tbody tr');
		j = 0;
		for (i = 0; i < $trs.length; i++)
		{
			if ($trs[i].cells[0].nodeName == 'TH') j = 0;
			if ($trs[i].style.display != 'none') j++;
			if (j%2) {
				$($trs[i]).addClass('even');
			} else {
				$($trs[i]).removeClass('even');
			}
		}

        if(window.customizeStylePremiumWriter)
        {
            customizeStylePremiumWriter();
        }
        if(OrderForm.hideZeroPriceDoctypes)
        {
            OrderForm.hideZeroPriceDoctypes();
        }
	},

	calculateTZOffset : function() {
        $deadline = $('#deadline');
		deadline_value = $deadline.val();
		timestamp = parseInt($('#original_deadline').val());
		if (!$deadline.length || typeof(deadline_value) == 'undefined' || !timestamp)
		{
			return;
		}

		i = 0;
		do {
			i++;
			deadline_converted = new Date(
				timestamp +
					Math.floor(i/2) * 60 * 60 * 1000 * (i%2 == 1 ? -1 : 1)
			).format('Y-m-d H:i:s');
		} while (deadline_value != deadline_converted);

		this.tzOffset = Math.floor(i/2) * (i%2 == 1 ? -1 : 1);
	},

    calculateFeaturesPrices : function(params) {
   		for (var ind in OrderForm.featurePrices)
		{
			if (document.getElementById('additional_' + ind) != null)
			{
                if(!OrderForm.values['additional_' + ind])
                {
                    OrderForm.onInputChange.call(document.getElementById('additional_' + ind));
                }
				f_price = Math.round(100 * parseFloat(OrderForm.featurePrices[ind](ind, OrderForm.getVasCount(ind))) * params.currencyRate) / 100;
                var no_price = OrderForm.formatCurrency('0.00', OrderForm.values.curr.value);

                if (!OrderForm.adminAuthorized && OrderForm.fieldDoctypes[ind] && OrderForm.isFreeFeatureByAdmin(OrderForm.fieldDoctypes[ind]))
                {
                    f_price = 0;
                }
                if (!params.popup){
                    OrderForm.showFeaturePrice(ind,
                        f_price > 0 ?
                            OrderForm.formatCurrency(f_price.toFixed(2), OrderForm.values.curr.value) :
                            no_price
                    );
                }
			}
		}
    },
    isFreeFeatureByAdmin : function(feature_doctype_id)
    {
        if (OrderForm.admin_free_vas && OrderForm.admin_free_vas[feature_doctype_id])
        {
            return true;
        }
        return false;
    },
    isFreeFeature : function(feature_doctype_id)
    {
        params = OrderForm.getSelectedParams();

        if (OrderForm.isFreeFeatureByAdmin(feature_doctype_id))
        {
            return true;
        }

        if (OrderForm.free_vas[params.doctype_id]){
            if (OrderForm.free_vas[params.doctype_id][params.urgency_id])
            {
               if (OrderForm.free_vas[params.doctype_id][params.urgency_id][params.wrlevel_id])
               {
                    if (OrderForm.free_vas[params.doctype_id][params.urgency_id][params.wrlevel_id][feature_doctype_id])
                    {
                        return true;
                    }
               }
            }
        }

        return false;
    },
    pickOutFreeFeatures : function(){
        params = OrderForm.getSelectedParams();
   		for (ind in OrderForm.featurePrices)
		{
			if (document.getElementById('additional_' + ind) != null && $('#additional_'+ind).is(':visible') && OrderForm.values['additional_' + ind])
			{
                field_doctype = OrderForm.fieldDoctypes[ind];
                $el = $('#additional_' + ind);

                $('#row_additional_'+ ind).find('.label').removeClass("free_feature_active");
				if (OrderForm.isFreeFeature(field_doctype))
                {
                    $('#row_additional_'+ ind).find('.label').addClass('free_feature_active');

                    OrderForm.values['additional_' + ind].checked = "checked";
                    $el.attr('checked', 'checked');
                    if ($el[0])
                    {
                        $el[0].checked = 'checked';
                    }
                    $el.change();
				}
			}
		}
    },

	calcPriceForDoctype : function (params) {
		this.d = params.doctype_id;
		this.u = params.urgency_id;
		this.w = params.wrlevel_id;
        this.cl = params.cover_letters;
		this.interval = params.interval;

		this.p = params.numpages;
		this.pp = params.numpapers;

		this.per_page = this.cost_per_page = this.calcCostPerPageForDoctype(params).cost_per_page_without_discount;

		this.group = 0;
		if (this.price_groups[this.d])
		{
			for (i in this.price_groups[this.d])
			{
				if ((parseInt(this.price_groups[this.d][i].to) == 0 || parseInt(this.price_groups[this.d][i].to) >= parseInt(this.p)) &&
						parseInt(this.price_groups[this.d][i].from) <= parseInt(this.p))
				{
					this.group = i;
					break;
				}
			}
		}
        
        if (!this.prices[this.d])
        {
            return false;
        }
        
        if (this.prices[this.d][this.w] == undefined) {
            var defaultDoctype = $('#doctype td input[type=radio]')[0];
            $(defaultDoctype).click();
            $(defaultDoctype).change();
        } else {
            this.per_page = Math.round(100 * (this.prices[this.d][this.w][this.u][this.group] * (parseInt(this.interval) + 1)) * params.currencyRate) / 100;
        }
		this.total_without_discount = this.cost_per_page * this.p * this.pp;

		if (this.group == 0)
		{
			this.discount = 0;
			for (from in OrderForm.cppDiscountRules) {
				if (this.p >= from) {
					this.discount = this.total_without_discount * OrderForm.cppDiscountRules[from] / 100;
				}
			}
		} else {
			this.discount = (this.cost_per_page - this.per_page) * this.p * this.pp;
		}
		this.discount = Math.round(this.discount * 100) / 100;

		discount_by_papers = 0.0;
		if (params.numpapers >= 2 && params.numpapers <= 3)
		{
			discount_by_papers = this.total_without_discount * 0.05;
		}
		else if (params.numpapers >= 4 && params.numpapers <= 5)
		{
			discount_by_papers = this.total_without_discount * 0.10;
		}
		else if (params.numpapers >= 6)
		{
			discount_by_papers = this.total_without_discount * 0.15;
		}

		if (discount_by_papers > this.discount) {
			this.discount = discount_by_papers;
		}

        //set general discount
        this.generalDiscountCalculated = this.total_without_discount * this.generalDiscount / 100;
        if (this.generalDiscountCalculated > this.discount)
		{
			this.discount = this.generalDiscountCalculated;
		}
        
		flag = false;
		hours = OrderForm.hours[params.doctype_id][params.urgency_id];
        
        switch(parseInt(OrderForm.discountCodeType))
		{
			case 0:
				if (this.total_without_discount >= params.currencyRate * 30 && OrderForm.discountCodeCoefficient * this.total_without_discount > this.discount)
				{
                    cl_price_dis = 0;
                    if (this.cl > 1) {
                        cl_price_dis = parseFloat(params.currencyRate) * 23 * (this.cl - 1);
                    }
					this.discount = OrderForm.discountCodeCoefficient * (this.total_without_discount + cl_price_dis);
				}
				break;
			case 1:
				if (this.total_without_discount >= params.currencyRate * 30 && OrderForm.discountCodeCoefficient > this.discount)
				{
					this.discount = OrderForm.discountCodeCoefficient;
				}
				break;
		}

        this.total_without_feature = this.total_without_discount - this.discount;
        
        this.calculateFeaturesPrices(params);
        
        non_discountable = 0;
		for (ind in this.featurePrices)
		{
			if ((OrderForm.version1 && OrderForm.version1_1) && !OrderForm.isPreview) {continue;}
			if (
				(feature = document.getElementById('additional_' + ind)) != null &&
				OrderForm.values['additional_' + ind] &&
				(
					feature.type != 'checkbox' ||
					feature.checked == true
				)
			)
			{
				price = parseFloat(OrderForm.featurePrices[ind](ind, OrderForm.getVasCount(ind))) * params.currencyRate;
                if (OrderForm.fieldDoctypes[ind] && OrderForm.isFreeFeatureByAdmin(OrderForm.fieldDoctypes[ind]))
                {
                    price = 0;
                }
				if (OrderForm.featureDiscountable[ind])
				{
					this.total_without_discount += price;
				}
				else
				{
					non_discountable += price;
				}
			}
		}

		if (document.getElementById('preff_wr_id') && ($preferred = $('#preff_wr_id input')).length > 0) {
			if (hours > 48)
			{
            	for (i = 0; i<$preferred.length; i++)
				{
					if ($preferred[i].value.match(/[0-9]+/))
					{
						flag = true;
						break;
					}
				}
			}
			if (flag)
			{
                var preff_wr_margin = typeof JsReg == 'object' && JsReg.get('preff_wr_margin') ? JsReg.get('preff_wr_margin') : 1.2;
                this.total_without_discount *= preff_wr_margin;
			}
		}

		for (ind in OrderForm.featurePrices)
		{
			if (document.getElementById('additional_' + ind) != null && OrderForm.values['additional_' + ind])
			{
				if ((OrderForm.version1 && OrderForm.version1_1) && !OrderForm.isPreview) {continue;}
				f_price = Math.round(100 * parseFloat(OrderForm.featurePrices[ind](ind, OrderForm.getVasCount(ind))) * params.currencyRate) / 100;
				if (!OrderForm.featureDiscountable[ind] &&
					(
						(feature = document.getElementById('additional_' + ind)) != null &&
						(
							feature.type != 'checkbox' ||
							feature.checked == true
						)
					)
				)
				{
                    if (OrderForm.fieldDoctypes[ind] && OrderForm.isFreeFeatureByAdmin(OrderForm.fieldDoctypes[ind]))
                    {
                        f_price = 0;
                    }
					this.total_without_discount += f_price;
				}
			}
		}

		this.total_with_discount = this.total_without_discount - this.discount;

		result = {
			cost_per_page          : parseFloat(this.cost_per_page).toFixed(2),
			total_without_discount : parseFloat(this.total_without_discount).toFixed(2),
			discount               : parseFloat(this.discount).toFixed(2),
			total                  : parseFloat(this.total_with_discount).toFixed(2),
			total_with_discount    : parseFloat(this.total_with_discount).toFixed(2),
            total_without_feature    : parseFloat(this.total_without_feature).toFixed(2)
		};

		return result;
	},

	savePreloadedJson : function(data) {
		for(id in data.html) {
			OrderForm.loaded[id] = data.html[id];
		}
		for(id in data.price_groups) {
			OrderForm.price_groups[id] = data.price_groups[id];
		}
		for(id in data.prices) {
			OrderForm.prices[id] = data.prices[id];
		}
		for(id in data.hours) {
			OrderForm.hours[id] = data.hours[id];
		}

		for(id in data.limits) {
			OrderForm.limits[id] = data.limits[id];
		}

	},

	preload : function()
	{
	//  OMG
		var loc = location.href;

		if (this.isResubmit && loc.indexOf('resubmit') >= 0 && !this.isPreview)
		{
			loc = loc.substring(0, loc.indexOf('resubmit') + 8) + '.popular/' + loc.substring(loc.indexOf('resubmit') + 9, loc.indexOf('resubmit') + 17);
		}
		else if (this.isQuote && !this.isPreview)
		{
			loc = loc.substring(0, loc.indexOf('quote') + 5) + '.popular/';

            if (OrderForm.step != 0)
            {
                loc += '?step=' + OrderForm.step;
            }
		}
		else if (OrderForm.step != 0)
		{
            loc = '/order.popular?step=' + OrderForm.step;
		}
        else if (OrderForm.isCalculator)
        {
			loc = '/order/calculator.popular/';
		}
		else
		{
			loc = '/order.popular/';
		}

		$.getJSON(loc, {}, OrderForm.savePreloadedJson);
	},

    checkPassword : function()
    {
		if (OrderForm.step == 3) return;
		email_value = OrderForm.values.email ? OrderForm.values.email.value : '';
		if ( email_value != '' )
		{
			numpages = OrderForm.values.numpages ? numpages = OrderForm.values.numpages.value : 0;
			var doctype = this.getDoctypeValue();
			if (this.isResubmit && !this.isPreview && OrderForm.adminAuthorized)
			{
				loc = location.href;
				loc = loc.substring(0, loc.indexOf('resubmit') - 1);
			}
			else
			{
				loc = '/order';
			}

			loc = loc + '.check-email/' + encodeURIComponent(email_value);

			$.getJSON(
				loc,
				{},
				OrderForm.onCheckPassword
			);
		}
        else
        {
            OrderForm.hidePassword();
        }

    },

    onCheckPassword : function(data)
    {
        if (data)
        {
            //set general discount
            if(data.generalDiscount != undefined && !isNaN(parseFloat(data.generalDiscount)))
            {
                OrderForm.generalDiscount = data.generalDiscount;
                OrderForm.calculatePrice();
            }
                
            OrderForm.showPassword();
        }
        else
        {
            OrderForm.hidePassword();
        }
    },

	onInputChange : function(){ 
        // Before onInputChange
        if(typeof FormSaver != 'undefined')
        {
            FormSaver.sendAjax(this);
        }

        for (ind in OrderForm.beforeOnInputChange)
		{
			OrderForm.beforeOnInputChange[ind].call(OrderForm, this);
		}
		if (this.name == 'doctype') {
			OrderForm.onDoctypeChange();
			return;
		}
		OrderForm.saveValue(this);

        if (this.id == 'o_interval' || this.id == 'wrlevel' || this.id == 'urgency')
        {
            OrderForm.showHidePages();
            if(OrderForm.BD_validation)
            {
                checkMaxNumpages();
            }
            OrderForm.fillNumpagesWithLimit();
        }
        if (this.id == 'urgency') OrderForm.showHidePreferredInputs();
		OrderForm.enableSubmit();

		if (this.id == 'email' || this.id == 'promo' || this.id == 'numpages')
		{
			OrderForm.checkPromoCode();
		}
        if (this.id == 'email' && !OrderForm.isResubmit)
        {
            OrderForm.checkPassword();
        }
		if (this.id != 'doctype' && this.name != 'doctype')
		{
			OrderForm.calculatePrice()
		}
        if(OrderForm.hideZeroPriceDoctypes)
        {
            OrderForm.hideZeroPriceDoctypes();
        }
        if(window.customizeStylePremiumWriter)
        {
            customizeStylePremiumWriter();
        }
		OrderForm.onInputChangeClearValidationError(this);

        // PickUp Free Feature
        if ( (this.name == 'doctype') || (this.name == 'wrlevel') || (this.name == 'urgency') ) {
            OrderForm.pickOutFreeFeatures();
        }
        if(OrderForm.order_features.onInputChange)
        {
            OrderForm.order_features.onInputChange();
        }

        if (OrderForm.showAcceptError && this.name == 'accept' && $(this)[0] && $(this)[0].checked == true)
        {
            if ($(this).val() == '1')
            {
                $('#error_accept').hide();
                $('#submit_order_form').removeAttr('disabled');                
            }else
            {
                $('#error_accept').show();
                $('#submit_order_form').attr('disabled','disabled');
            }
        }

        // After onInputChange
        for (ind in OrderForm.afterOnInputChange)
		{
			OrderForm.afterOnInputChange[ind].call(OrderForm, this);
		}
	},

	onInputChangeClearValidationError : function(input) {
	},

	onAjaxRespond : function(data) {
		OrderForm.loaded[data.id] = data.html;

		for(id in data.price_groups) {
			OrderForm.price_groups[id] = data.price_groups[id];
		}
		for(id in data.prices) {
			OrderForm.prices[id] = data.prices[id];
		}
		for (id in data.hours) {
			OrderForm.hours[id] = data.hours[id];
		}
		for (id in data.limits) {
			OrderForm.limits[id] = data.limits[id];
		}

		$('#doctype_loading').remove();
		$('#order_details').find('input:not(.disabled_email_input),select,textarea').removeAttr('disabled');

        OrderForm.doctype = data.id;

		OrderForm.switchForms(data.id);
        if(OrderForm.sp_validation)
        {
            ckeckOnSwitchDoctype(OrderForm.was_proceed);
        }

		if ( OrderForm.doctype == 182 )
		{
			$('#operational_system option:first').attr("selected",true);
		}

	},

	focusOnDoctype : function() {
        if(OrderForm.sp_validation)
        {
            ckeckOnSwitchDoctype(OrderForm.was_proceed);
        }        
        try {
            $doctype = $('#doctype');
            if ($doctype[0].tagName == 'INPUT' || $doctype[0].tagName == 'SELECT') {
                $doctype[0].focus();
            } else {
                $dt = $('#doctype_' + this.doctype);
                $dt[0].checked = true;
                $dt[0].focus();
            }
        }
        catch(e){}
	},

	onDoctypeChange : function() {
		$order_details = $('#order_details');
        OrderForm.values.cover_letters = 1;
		this.doctype = this.getDoctypeValue();
        
		if (!this.loaded[this.doctype] && !OrderForm.isResumes) {
			$('#doctype').after('<span id="doctype_loading"><img src="/res/img/template/doctype-loading.gif" />Loading...</span>');
			$('#order_details').find('input:not(.disabled_email_input),select,textarea').attr('disabled', 'disabled');
            if(OrderForm.BD_validation)
            {
                checkMaxNumpages();
                OrderForm.values.numpages = 1;
            }
	//      OMG
			var loc = location.href;
			if (OrderForm.isResubmit) {
				loc = loc.substring(0, loc.indexOf('resubmit') + 8) + '.ajax/' + loc.substring(loc.indexOf('resubmit') + 9, loc.indexOf('resubmit') + 17);
				if (loc[loc.length - 1] != '/') {
					loc += '/';
				}
            } else
			if (OrderForm.isQuote) {
				loc = loc.substring(0, loc.indexOf('quote') + 5) + '.ajax/';
				if (loc[loc.length - 1] != '/') {
					loc += '/';
				}
			} else
			if (OrderForm.isCalculator) {
				loc = '/order/calculator.ajax/';
			} else {
				loc = '/order.ajax/';
            }
            urll = loc + this.doctype;
            if (OrderForm.step != 0)
            {
                urll = loc + this.doctype + '?step=' + OrderForm.step;
            }

			$.getJSON(urll, {}, OrderForm.onAjaxRespond);
		} else {
			OrderForm.switchForms(this.doctype);
			OrderForm.focusOnDoctype();
            if ( OrderForm.doctype == 182 && $('#operational_system option').text() != 'select')
            {
                $('#operational_system option:first').attr("selected",true);
            }
		}
            if(OrderForm.sp_validation)
            {
                ckeckOnSwitchDoctype(OrderForm.was_proceed);
            }
            if(OrderForm.BD_validation)
            {
                ckeckOnSwitchDoctype(this.doctype);
            }
         var cover_letters = $('#cover_letters');
        if (cover_letters.length)
        {
            OrderForm.values.cover_letters.value = 1;
            cover_letters.val(1);
        }
        this.attachBubblePopup();
	},
    attachBubblePopup : function(){
        var popup = $('#bubble-poppup');
        var popupOrigin = $('#bubble-popup-origin');
        var accept = $('.accept');
        popupOrigin.remove().appendTo("body");

        accept.click(function(e){
            return false;
        });
        

        if (popup.length && popupOrigin.length)
        {
            var offset = popup.offset();
            var hght = popupOrigin.height();
            offset.left = offset.left - popupOrigin.width()/2 + popup.width()/2;
            offset.top = offset.top - hght;
            popupOrigin.css({'top': offset.top, 'left': offset.left});     
            
            accept.hover(function(){
               popupOrigin.fadeIn();
               return false;
            }, function(){
               popupOrigin.fadeOut();
               return false;
            });
        }
    },
	addPreferredWriterInput : function(value) {
		$pref_input = $('#preff_wr_id');
		$parent = $pref_input.find('li:last');
		$element = $('<li>' + $parent.html() + '</li>');
		$element.find('input')
			.val('')
			.change(OrderForm.onInputChange)
			.removeClass('validation_error');
		$element.find('div.validation_error').hide();
		$parent.parent().append($element);

		$pref_input.find('.add:first').remove();

		$inputs = $pref_input.find('input');
		if ($inputs.length == 2) {
			$inputs.after(OrderForm.removePrefWriterImg);
		}
		if ($inputs.length > OrderForm.max_preferred_writers) {
            if ($('#preff_wr_id .add').length == 0) {
                $pref_input.find('.add').remove();
            }else{
                $('#add').css('display','none');
            }
		} else {
			$pref_input.find('.add')
					.show()
					.click(OrderForm.addPreferredWriterInput);
		}
        OrderForm.onInputChangeClearValidationError();
		$pref_input.find('.delete').click(OrderForm.removePrefWriter);
        
        OrderForm.onAfterAddPreferredWriterInput();
	},

	removePrefWriter : function() {
		if ($(this).parent().find('input').val() == '' || window.confirm('Yes, I confirm I want to delete this preferred writer'))
		{
			$(this).parent().remove();
			$inputs = $('#preff_wr_id input');
			if ($('#preff_wr_id .add').length == 0 && $('#add').length == 0) {
                if (!OrderForm.BE){
                    $('#preff_wr_id .delete:last').after('<img src="/res/img/template/addgreen16x16.gif" alt="+" title="Add writer" class="add" />');
                } else {
                    $('#preff_wr_id .delete:last').after('<img src="/res/img/order/addgreen16x16.gif" alt="+" title="Add writer" class="add" />');
                }
				$('#preff_wr_id .add').click(OrderForm.addPreferredWriterInput);
			}else{
                $('#add').css('display','block');
            }
			if ($inputs.length == 1) {
				$('#preff_wr_id .delete').remove();
			}
			OrderForm.saveValue($inputs[0]);
			OrderForm.calculatePrice();
            OrderForm.onInputChangeClearValidationError();
		}
        
        OrderForm.onAfterRemovePrefWriter();
	},

	fillNumpages : function() {
		$options = $('#numpages option');
		if (OrderForm.values.o_interval) {
			spacing = OrderForm.values.o_interval.value;
			words = OrderForm.numpages_append_words && !this.nonWordsProducts[this.doctype];
			words_per_page = 275 * (spacing == '1' ? 2 : 1);

			$num_pg_ord = $('#num_pg_ord');
			if ($num_pg_ord.length) {
				$num_pg_ord.html($num_pg_ord.html().replace(/(\d+)/, words_per_page));
			}
			if (words) {
				for (i = 0; i < $options.length; i++) {
                    if($options[i].value == 0)
                    {
                        $options[i].text = 'select';
                    }
                    else
                    {
                        $options[i].text = $options[i].value + ' page(s) / ' + $options[i].value*words_per_page + ' words'
                    }
				}
			} else {
				for (i = 0; i < $options.length; i++) {
                    if($options[i].value == 0)
                    {
                        $options[i].text = 'select';
                    }
                    else
                    {
    					$options[i].text = $options[i].value;
                    }
				}
			}
		}
        else
        {
            for (i = 0; i < $options.length; i++) {
                if($options[i].value == 0)
                {
                    $options[i].text = 'select';
                }
                else
                {
                    $options[i].text = $options[i].value;
                }
            }
        }

		OrderForm.$pages_options = [];
		for (i = 0; i < $options.length; i++)
		{
			OrderForm.$pages_options.push({v: parseInt($options[i].value), t : $options[i].text});
		}
        
        //set data-value for select numpages (fix for ESSAY-748)
        var dataValue = $('#numpages_old').attr('data-value');
        dataValue && $('#numpages').attr('data-value', dataValue).val(dataValue);     
	},
	fillNumpagesWithLimit : function() {
		$options = $('#numpages option');
		if (OrderForm.values.o_interval) {
			spacing = OrderForm.values.o_interval.value;
			words = OrderForm.numpages_append_words && !this.nonWordsProducts[this.doctype];
			words_per_page = 275 * (spacing == '1' ? 2 : 1);

			$num_pg_ord = $('#num_pg_ord');
			if ($num_pg_ord.length) {
				$num_pg_ord.html($num_pg_ord.html().replace(/(\d+)/, words_per_page));
			}
			if (words) {
				for (i = 0; i < $options.length; i++) {
                    if($options[i].value == 0)
                    {
                        $options[i].text = 'select';
                    }
                    else
                    {
                        $options[i].text = $options[i].value + ' page(s) / ' + $options[i].value*words_per_page + ' words'
                    }
				}
			} else {
				for (i = 0; i < $options.length; i++) {
                    if($options[i].value == 0)
                    {
                        $options[i].text = 'select';
                    }
                    else
                    {
    					$options[i].text = $options[i].value;
                    }
				}
			}
		}
	},

	showHidePages : function() {
		try {
			limit = OrderForm.limits[this.doctype][this.values.wrlevel.value][this.values.urgency.value];

            if (limit != undefined && OrderForm.values.o_interval != undefined)
            {
                spacing = parseInt(OrderForm.values.o_interval.value);
                limit = parseInt( limit / (spacing + 1) );
            }
		}
		catch (e) {
            if (OrderForm.$pages_options[0] != undefined && OrderForm.$pages_options[0].v > 1)
            {
                limit = OrderForm.$pages_options.length + OrderForm.$pages_options[0].v - 1;
            }
            else
            {
                limit = OrderForm.$pages_options.length;
            }
		}
		if (limit == undefined) 
        {
            if (OrderForm.$pages_options[0] != undefined && OrderForm.$pages_options[0].v > 1)
            {
                limit = OrderForm.$pages_options.length + OrderForm.$pages_options[0].v - 1;
            }
            else
            {
                limit = OrderForm.$pages_options.length;
            }

        }

		$numpages = $('select#numpages');
        if ($numpages.length > 0)
        {
            val = $numpages.val();

            max = 0;
            opts = $numpages[0].options;
            for (i = 0; i < opts.length; i++)
            {
                option = opts[i];
                opt_value = parseInt(option.value);
                if (opt_value > limit || OrderForm.$pages_options[i].v != option.value)
                {
                    $numpages[0].removeChild(option);
                    i--;
                }
                else
                if (opt_value > max)
                {
                    max = opt_value;
                }
            }
            if (max < limit)
            {
                for (i = 0; i < OrderForm.$pages_options.length; i++)
                {
                    opt = OrderForm.$pages_options[i];
                    if (opt.v <= limit && opt.v > max)
                    {
                        $numpages.append('<option value="' + opt.v + '">' + opt.t + '</option>');
                    }
                }
            }

            $options = $('#numpages option');
            spacing = OrderForm.values.o_interval.value;
            if (spacing == '1' && $options.length == 1 && $options[0].value == '0')
            {
                $options.parent().append('<option value="1"></option>');
                OrderForm.fillNumpagesWithLimit();
                val = 1;
            }
       		$numpages.val(val);
            $numpages.change();
        }

	},

	deadlineExtendByUrgencyChange : function() {
		if(OrderForm.orderDate && $('#deadline').length)
		{
			var hours = 0;
			urgency_id = $('#urgency').val();
			current_doctype = $('#doctype').val();
            if (!current_doctype) {
                current_doctype = $('#doctype input:radio:checked').val();
            }
			if(OrderForm.hours[current_doctype] != undefined && OrderForm.hours[current_doctype][urgency_id] != undefined)
			{
				hours = OrderForm.hours[current_doctype][urgency_id];
				if(hours > 0)
				{
					originalOrderDate = parseInt(OrderForm.orderDate);
					real = new Date(originalOrderDate * 1000 + Math.abs(hours * 60 * 60 *1000) + OrderForm.tzOffset * 60 * 60 *1000 );
					$('#deadline').val(real.format('Y-m-d H:i:s'));
                    $('#original_deadline').val(real.format('U') * 1000 - OrderForm.tzOffset * 60 * 60 * 1000);
                    OrderForm.deadlineExtendChange();
				}
			}
		}
	},

	deadlineExtendChange : function() {
		add_hours = parseInt($('#extend_hours').val());
		add_days  = parseInt($('#extend_days').val());
		original  = parseInt($('#original_deadline').val());
		real = new Date(Math.abs(add_hours * 60 * 60 * 1000) + Math.abs(add_days * 24 * 60 * 60 * 1000)
						+ original + OrderForm.tzOffset * 60 * 60 * 1000
		);

		$('#deadline').val(real.format('Y-m-d H:i:s'));
	},

	validate : function(onValidate) {
        for (var i in OrderForm.beforeValidate)
        {
            OrderForm.beforeValidate[i].call(OrderForm, this);
        }
        if(OrderForm.validationImgBtn){
            $('#submit_order_form').css('background',OrderForm.validationImgBtn);
        }else{
			OrderForm.previewName = $('#submit_order_form').val();
            if (onValidate == undefined)
            {
                $('#submit_order_form').val(OrderForm.validationName);
                $('#submit_order_form').addClass("button_wait_validation");
            }
        }
        
		if(!onValidate)
        {
            $('#submit_order_form').attr('disabled', 'disabled');
        }


		OrderForm.validateObject = {doctype: OrderForm.getDoctypeValue()};
		for (field in OrderForm.validateFields)
		{
            var fieldElm = $('#' + OrderForm.validateFields[field]);
			if (fieldElm.length)
			{
                
                if (fieldElm.is(":checkbox")){
                    if (fieldElm.attr("checked")){
                        OrderForm.validateObject[OrderForm.validateFields[field]] = fieldElm.val();
                    }
                } else {
                    OrderForm.validateObject[OrderForm.validateFields[field]] = fieldElm.val();
                }
			}
		}

		for (field in OrderForm.validateArrayFields)
		{
			if (OrderForm.validateArrayFields[field] == 'preff_wr_id' && OrderForm.getSelectedHours() <= 48) continue;
			if ($('#' + OrderForm.validateArrayFields[field] + ' input').length)
			{
				OrderForm.temp = new Array();
				$('#' + OrderForm.validateArrayFields[field] + ' input').each(function(){
					OrderForm.temp[OrderForm.temp.length] = this.value;
				});
				OrderForm.validateObject[OrderForm.validateArrayFields[field] + '[]'] = OrderForm.temp;
			}
		}

		if ($('#accept').length)
		{
			if ($('#accept input[name=accept]').length) {
				OrderForm.validateObject['accept'] = $('#accept input[name=accept]:checked').val();
			} else {
                if ($('#accept[type=checkbox]').length)
                {
                    OrderForm.validateObject['accept'] = $('#accept:checked').val();
                }
                else
                {
                    OrderForm.validateObject['accept'] = $('#accept').val();
                }
			}
		}

		if (onValidate == undefined)
		{
			onValidate = OrderForm.onValidate;
		}

        if (!OrderForm.isResumes || (OrderForm.isResumes && OrderForm.isResubmit))
        {
            $.ajaxSetup({async:false});
        }

        $.post(OrderForm.validateAction, OrderForm.validateObject, onValidate);
        if (OrderForm.isResumes && OrderForm.isResubmit)
        {
            $.ajaxSetup({async:true});
        }
        
        if (OrderForm.sp_validation)
        {
            OrderForm.was_proceed = 1;
        }
        
		return false;
	},

	hideValidationErrors : function() {
		for (field in OrderForm.validateFields) {
			$('#error_' + OrderForm.validateFields[field]).hide();
            $row = $('#row_' +  + OrderForm.validateFields[field]);
            if ($row.length == 0) $row = $('#' + OrderForm.validateFields[field]).parents('tr:first');
            $row.removeClass('validation-error');
			$('#' + OrderForm.validateFields[field]).removeClass('validation_error');
            $div = $('div.eot');
            if ($div.length) {
                $('#' + OrderForm.validateFields[field]).css("background-color","#FFFFFF");
            }

		}

		for (field in OrderForm.validateArrayFields) {
            $div = $('div.eot');
            if ($div.length) {
                $('#' + OrderForm.validateFields[field]).css("background-color","#FFFFFF");
            }
			if ($('#' + OrderForm.validateArrayFields[field] + ' input').length) {
				$('#' + OrderForm.validateArrayFields[field] + ' input').each(function(){
					$(this).removeClass('validation_error');
				});

			}
			if ($('#' + OrderForm.validateArrayFields[field] + ' div.validation_error').length) {
				$('#' + OrderForm.validateArrayFields[field] + ' div.validation_error').each(function(){
					$(this).hide();
				});
			}
		}
	},
    hideValidationFieldError : function(field){
        field.removeClass('validation_error');
        field.parents('td').find('div.validation_error:visible').hide();
        OrderForm.hideValidationFieldState(field);
    },
    hideValidationFieldState : function(field){
        field.parents('td').find('.state').removeClass('state_true');
        field.parents('td').find('.state').removeClass('state_false');
    },
    filterErors: function(data, field) {
        var errors = '{}';
        if (typeof data[field] != "undefined")
        {
            errors = '{"' + field + '" : '+ data[field] + '}';
        }
        return errors;
    },
	onValidateFieldRespond : function(data, field) {
        OrderForm.hideValidationFieldError(field);
        errors = eval('(' + data + ')');
        for (error in errors) {
            $('#error_' + error).show();
            $row = $('#row_' + error);
            $row.addClass('validation-error');
            $row = $('#row_' + error);
            $row.addClass('validation-error');
            $('#' + error).addClass('validation_error');
            $('#' + error).parents('td').find('.state').addClass('state_false');
            $('#' + error).parents('td').find('.state').removeClass('state_true');
        }
	},
	onValidateRespond : function(data) {
        OrderForm.hideValidationErrors();
        errors = eval('(' + data + ')');
        OrderForm.form_valid = 1;
        for (error in errors) {
            if (errors[error] != true) {
                for (index in errors[error]) {
                    $div = $('#' + error + ' div.validation_error');
                    if ($div.length) {
                        $($div[index]).show();
                        $($('#' + error + ' input')[index]).addClass('validation_error');


                    } else {
                        $('#error_' + error).show();
                        $('#row_' + error).addClass('validation-error');
                        $('#' + error).addClass('validation_error');
                    }
                }
            } else {
                $div = $('div.eot');
                if ($div.length) {
                    $('#' + error).css("background-color","#ff9999");
                }
                $('#error_' + error).show();
                $row = $('#row_' + error);
                if ($row.length == 0) $row = $('#' + error).parents('tr:first');
                $row.addClass('validation-error');
                $('#' + error).addClass('validation_error');
                $('#' + error).parents('td').find('.state').addClass('state_false');
                $('#' + error).parents('td').find('.state').removeClass('state_true');
                if (OrderForm.sp_validation)
                {
                    $('#' + error).addClass('error_field');
                    if ($('#' + error + '-button').length > 0)
                    {
                        $('#' + error + '-button').addClass('error_field');
                    }
                    if (error == 'phone1')
                    {
                        $('#phone1_area').addClass('error_field');
                        $('#phone1_number').addClass('error_field');
                    }
                }                
                if (OrderForm.BD_validation)
                {
                    $('#' + error).addClass('error_field');
                    if($('#' + error + '-button'))
                    {
                        $('#' + error + '-button').addClass('error_field');        
                    }
                    $('#' + error).parents('div:first').addClass('valid_error_mark');
                    if (error == 'phone1')
                    {
                        $('#phone1_area').addClass('error_field');
                        $('#phone1_number').addClass('error_field');
                    }
                    if (error == 'phone2')
                    {
                        $('#phone2_area').addClass('error_field');
                        $('#phone2_number').addClass('error_field');
                    }
                }
                if (OrderForm.BTP_validation)
                {
                     if (error == 'phone1_number')
                     {
                        $('#error_phone1').show();
                     }   
                }
			}
			OrderForm.form_valid = 0;
		}
        for (ind in OrderForm.afterOnValidateRespond)
		{
			OrderForm.afterOnValidateRespond[ind].call(OrderForm, this, errors);
		}
	},
    onValidateField : function(field) {
        return function(data, textStatus) {
            if (field.val() != '' || field.is('select') || field.is('#phone1'))
            {
                var errors = OrderForm.filterErors(eval('('+ data +')'), field.attr('id'));
                var obj = eval('('+ errors +')');
                size = 0;
                for (i in obj)
                {
                    size++;
                }
                if  (size == 0)
                {
                    field.removeClass('validation_error');
                    field.parents('td').find('div.validation_error:visible').hide();
                    field.parents('td').find('.state').addClass('state_true');
                    field.parents('td').find('.state').removeClass('state_false');
                    if ($('#retype_email').length > 0)
                    {                    
                        if (field.attr('id') == 'email' && $('#retype_email').val().length > 0)
                            {
                                OrderForm.validate(OrderForm.onValidateField($('#retype_email')));
                            }
                    }
                }
                else
                {
                    OrderForm.onValidateFieldRespond(errors, field);
                }
            }
            if(OrderForm.previewImgBtn){
                $('#submit_order_form').css('background',OrderForm.previewImgBtn);
            }else{
                $('#submit_order_form').val(OrderForm.previewName);
                $('#submit_order_form').removeClass("button_wait_validation");
            }
			$('#submit_order_form').removeAttr('disabled');
        };
    },
	onValidate : function(data) {
                if (OrderForm.onValidateDataPreprocessor) 
                {
                    data = OrderForm.onValidateDataPreprocessor(data);
                }  
		OrderForm.onValidateRespond(data);           
		if (OrderForm.form_valid)
		{
			OrderForm.submitValidatedForm();
		}
		else
		{
            if (OrderForm.isResumes)
            {
                OrderForm.hideLoading();
            }
            if(OrderForm.previewImgBtn){
                $('#submit_order_form').css('background',OrderForm.previewImgBtn);
            }else{
                $('#submit_order_form').val(OrderForm.previewName);
                $('#submit_order_form').removeClass("button_wait_validation");
            }
			$('#submit_order_form').removeAttr('disabled');
			errors = eval('(' + data + ')');
			if ($('.validation_error:visible:first').length > 0) {
				$t = $('.validation_error:visible:first');
				while ($t[0].id == '') {$t = $t.parent();}
				window.location.href = (OrderForm.switch_to_row_after_error ? '#row_' : '#') + $t[0].id;
			}
		}
	},

	setDiscountValue : function(value)
	{
		var discount = OrderForm.formatCurrency(value.discount, OrderForm.values.curr.value),
			discount_percent = Math.round(100 * value.discount / (value.cost_per_page * params.numpages * params.numpapers));

		if ($('#discount').attr('tagName') != 'INPUT')
		{
			$('#discount').html(discount);
		}
		else
		{
			$('#discount').val(discount);
		}

		if ($('#discount_percent').attr('tagName') != 'INPUT')
		{
			$('#discount_percent').html(discount_percent);
		}
		else
		{
			$('#discount_percent').val(discount_percent);
		}
	},

	showDiscount : function() {
		if (!OrderForm.isQuote)
		{
			$('#discount_span').show();
			$('#total_without_discount').show();
		}
	},

    hidePassword : function()
    {
        $('#row_password').hide();
        OrderForm.repaintTable();
    },

    showPassword : function()
    {
        $('#row_password').show();
        $('#password').val('');
        $('#row_password div.validation_error').hide();
        OrderForm.repaintTable();
    },

	hideDiscount : function() {
		$('#discount_span').hide();
		$('#total_without_discount').hide();
	},

	getSelectedHours : function() {
		if (OrderForm.hours[OrderForm.getDoctypeValue()]) {
			return OrderForm.hours[OrderForm.getDoctypeValue()][OrderForm.values.urgency.value];
		}
		return 0;
	},

	formatCurrency : function(value, currency) {
		result = currency + ' ' + value;
		if (OrderForm.currenciesFormat[currency]) {
			format = OrderForm.currenciesFormat[currency];
			result = format.replace('%s', value);
		}
		return result;
	},
	getSelectedParams : function() {
        var categoryElm = $('#order_category');
		interval = OrderForm.values.o_interval && OrderForm.values.o_interval.value ? OrderForm.values.o_interval.value : 0;

		if (OrderForm.values.curr && OrderForm.values.curr.value && OrderForm.currencyRates.USD[OrderForm.values.curr.value]) {
			multiplier = OrderForm.currencyRates.USD[OrderForm.values.curr.value];
		} else {
			multiplier = 1;
		}
        if (!OrderForm.values.order_category && categoryElm.length)
        {
            this.saveValue(categoryElm.get(0));
        }
        
		params = {
			doctype_id : OrderForm.doctype,
			urgency_id : OrderForm.values.urgency.value,
			wrlevel_id : (OrderForm.values.wrlevel ? OrderForm.values.wrlevel.value : 1),
            category_id : OrderForm.values.order_category ? OrderForm.values.order_category.value : (OrderForm.doctype == 182 ? 65 : 0),
			interval : interval,
			currencyRate : multiplier,
			numpages : Math.max(OrderForm.values.numpages && OrderForm.values.numpages.value ? OrderForm.values.numpages.value : 1, 1),
			numpapers : Math.max(OrderForm.values.numpapers && OrderForm.values.numpapers.value ? OrderForm.values.numpapers.value : 1, 1),
            cover_letters : Math.max(OrderForm.values.cover_letters && OrderForm.values.cover_letters.value ? OrderForm.values.cover_letters.value : 1, 1)
		};
		return params;
	},
	enableSubmit : function() {
	},
    TermConditionPopup : {
        isShow : false,
        needShow : function()
        {
            result = false;
			if (OrderForm.step != 3)
			{
				$accept_input = $('[name=accept]:checked');
				if (
					$('#terms-conditions-popup').length > 0 &&
					!(
						$accept_input.val() == '1' ||
						$accept_input.val() == 'accept' ||
						OrderForm.isPreview ||
						$('[name=accept]').length &&
						$('[name=accept]:first').attr('type') == 'hidden'
					)
				)
				{
				   result = true;
				}
			}
            return result;
        },
        show : function()
        {
            $('#terms-conditions-popup').show();
            $('body').append('<div id="premium-dialog-overlay"></div>');
            if(-[1,]) ;else { // if IE
                $('#order_form').find('select').css('visibility', 'hidden');
            }
            OrderForm.TermConditionPopup.isShow = true;
        },

        hide : function()
        {
            $('#terms-conditions-popup').hide();
            $('#premium-dialog-overlay').remove();
            if(-[1,]) ;else { // if IE
                $('#order_form').find('select').css('visibility', 'visible');
            }

            // Show preview button
            if(OrderForm.previewImgBtn){
                $('#submit_order_form').css('background',OrderForm.previewImgBtn);
            }else{
                $('#submit_order_form').val(OrderForm.previewName);
                $('#submit_order_form').removeClass("button_wait_validation");
            }
			$('#submit_order_form').removeAttr('disabled');

            OrderForm.TermConditionPopup.isShow = false;
        },
        accept : function()
        {
            OrderForm.submitValidatedForm();
        }
    },
	submitValidatedForm : function()
	{
        if (!OrderForm.isResumes)
        {
            OrderForm.form_valid = 0;
        }
        if (!OrderForm.TermConditionPopup.isShow && OrderForm.TermConditionPopup.needShow() )
        {
            OrderForm.TermConditionPopup.show();
        }else
        {
            if (OrderForm.isPaypal)
            {
                OrderForm.trackGA('payment');
            }
            
			$('#order_form').append('<input type="hidden" name="proceed" value="true" />');
            $('input[name=cancel]').attr('disabled','disabled');
            if (!OrderForm.ForceSubmit) 
            {
                $('input[name=preview]').removeAttr('disabled');
            }

            OrderForm.callSubmitFromSubmitValidatedForm = true;

            $('#order_form').submit();
            if ((OrderForm.isResumes || OrderForm.isTranslation) && !OrderForm.isResubmit)
            {
                $('#back_order_form_step_1').attr('disabled', 'disabled')
                $('#submit_order_form_step_2').attr('disabled', 'disabled')
                $('#submit_order_form_step_1').click();
            }
            if (!OrderForm.isResumes && !OrderForm.isTranslation || OrderForm.isResubmit)
            {
                $('#order_form').find('input[type=submit],input[type=image]').click();
            }
            if (OrderForm.isResumes)
            {
                OrderForm.showLoading();
            }
        }
	},
    submitResumes : function()
    {
        var submit = $('#submit_order_form').val();
        var proceedButton = $('#'+submit);
        proceedButton.toggleClass('please-wait');
        switch (proceedButton.attr('id'))
        {
            case 'submit_order_form_step_2':
                if(OrderForm.isResubmit)
                {
                    if(OrderForm.form_valid)
                    {
                        $('input,textarea,select').removeAttr('disabled');
                        proceedButton.removeAttr('disabled');
                        return true;
                    }
                    else
                    {
                        OrderForm.validate();
                        OrderForm.trackGA();
                        OrderForm.showBlock(2);
                    }
                }
                else
                {
                    if ($('#accept').attr('checked') == false)
                    {
                        OrderForm.form_valid = false;
                        $("#error_accept").show();
                        OrderForm.hideLoading();
                        break;
                    }
                    else {
                       $("#error_accept").hide();
                    }
                    OrderForm.changeURLStep(2);
                    OrderForm.trackGA();
                    OrderForm.showBlock(1);
                }
                $('.step_image').attr('src', OrderForm.secondStepImage);
                $('#order_testimonials').hide();
                $('#clr_block').hide();
                $('#img_block1').hide();
                $('#img_block2').hide();
                $('#features_order_block1').hide();
                $('#features_order_block3').hide();
                OrderForm.hideLoading();
                break;
            case 'submit_order_form_step_1':
                if (OrderForm.form_valid){
                    $('input:not(.disabled_email_input), textarea, select').removeAttr('disabled', 'disabled');
                    return true;
                }
                OrderForm.enableInputs();
                OrderForm.validate();
                break;
            case 'back_order_form_step_1':
                OrderForm.changeURLStep(1);
                $('#features_order_block1').show();
                $('#features_order_block3').show();
                OrderForm.showBlock(2);
                OrderForm.hideLoading();
                break;
        }
        proceedButton.toggleClass('please-wait');
        
    },
	submit : function()
	{
        if(OrderForm.callSubmitFromSubmitValidatedForm)
        {
            OrderForm.callSubmitFromSubmitValidatedForm = false;
            return true;
        }
        
        if(OrderForm.isResumes || OrderForm.isTranslation)
        {
            if (OrderForm.form_valid)
            {
                return OrderForm.submitResumes();
            }
            else
            {
                OrderForm.showLoading();
                OrderForm.submitResumes();
            }
        }
        else
        {
            OrderForm.validate();

            if (OrderForm.form_valid)
            {
                OrderForm.submitValidatedForm();
            }

            OrderForm.form_valid = 0;
        }
		return false;
	},

    showFeaturePrice : function(ind, price)
	{
		var $element = $('#additional_' + ind + '_price'),
            span_price = $element.find("span.vas_price");
        if (span_price.length)
        {
            span_price.html(price);
        }
        else if ($element.hasClass("pretty")){
            var html = $(".holderWrap", $element).clone(true);
            if (html.length){
                $element.html(html);
                $element.prepend(price);
            } else {
                $element.html(price);                                
            }
        } else
        {
            $element.html(price);                
        }
                
		for (a in OrderForm.afterShowFeaturePrice) {
			OrderForm.afterShowFeaturePrice[a].call(OrderForm, {id: ind, price: price, element : $element});
		}
	},
	getVasCount : function(ind)
	{
		result = 1;
		if ((a = OrderForm.values['count_additional_' + ind]))
		{
			result = Math.max(result, a.value);
		}
		return result;
	},
	updateLinearSelects : function()
	{
		var $selects = $('#order_form select.linear');

		for (var i = 0; i < $selects.length; i++)
		{
			var container = OrderForm.linear_options.container.clone();

            if ($selects[i].id)
            {
	            container.attr('id', 'linear-select-'+$selects[i].id);
            }

			for (var j = 0; j < $selects[i].options.length; j++)
			{
				var entry = OrderForm.linear_options.entry.clone();

				if ((j+1) == $selects[i].options.length)
                {
                    entry.addClass('linear-last-opt');
                }
                else if (j == 0)
                {
                    entry.addClass('linear-first-opt');
                }

				if ($selects[i].options[j].selected == true)
				{
                    if ((j+1) == $selects[i].options.length)
                    {
                        entry.addClass('linear-last-opt-selected');
                    }
                    else if(j == 0)
                    {
                        entry.addClass('linear-first-opt-selected');
                    }

					entry.addClass('selected');
				}

				entry.append('<input type="hidden" value="' + $selects[i].options[j].value + '" />');

				if (OrderForm.linear_options.wrap_title
						&& OrderForm.linear_options.wrap_title instanceof jQuery)
				{
					var el = OrderForm.linear_options.wrap_title.clone();
					entry.append(el.append($selects[i].options[j].text));
				}
				else
				{
					entry.append($selects[i].options[j].text);
				}

				if (OrderForm.linear_options.wrap_entry
						&& OrderForm.linear_options.wrap_entry instanceof jQuery)
				{
					var entry_wrap_el = OrderForm.linear_options.wrap_entry.clone();
					container.append(entry_wrap_el.append(entry));
				}
				else
				{
                    if (!OrderForm.linear_options.reverse)
                    {
                        container.append(entry);
                    }
                    else
                    {
                        container.prepend(entry);
                    }
				}

                if (OrderForm.linearSelectDelimiter && j !== $selects[i].options.length - 1)
                {
                    container.append("&nbsp;" + OrderForm.linearSelectDelimiter + " &nbsp;");
                }
			}

			$($selects[i]).hide().after(container);
		}

		$('.linear-select a').click(function()
		{
			if (!$(this).hasClass('selected'))
			{
				var container = $(this).parent();

				if (OrderForm.linear_options.wrap_entry)
				{
					container = container.parent();
				}

				$select = container.parent().find('select');
				$select.val($(this).find('input').val()).change();

				container.find('.selected')
	                .removeClass('linear-last-opt-selected')
                    .removeClass('linear-first-opt-selected')
	                .removeClass('selected');

                if ($(this).hasClass('linear-last-opt'))
                {
                    $(this).addClass('linear-last-opt-selected');
                }

                if ($(this).hasClass('linear-last-opt'))
                {
                    $(this).addClass('linear-first-opt-selected');
                }

				$(this).addClass('selected');
			}

			return false;
		});
	},
    updateCheckboxes : function()
    {
        $checkboxes = $('#order_form input[type=checkbox].reformed');
		for (i = 0; i < $checkboxes.length; i++) {
            controlId = '';
            if ($checkboxes[i].id) {
                controlId = ' id="sweet-checkbox-' + $checkboxes[i].id + '"';
            }
            $class = $checkboxes[i].checked ? ' checked' : '';
			$control = $('<span class="sweet-checkbox" ' + controlId + ' />');
            $button = $('<a href="#" class="' + $class + '">&nbsp;</a>');
            $button.append('<input type="hidden" value="' + $checkboxes[i].value + '" />');
            $control.append($button);
            $($checkboxes[i]).hide().after($control);
        }
        
		$('#order_form .sweet-checkbox a').click(function() {
            $checkbox_name = $(this).closest('span.sweet-checkbox').attr('id').replace('sweet-checkbox-', '');
            $checkbox = $('input#'+$checkbox_name);
			if (!$(this).hasClass('checked')) {
                $checkbox[0].click();
                $checkbox.attr('checked', 'checked');
				$(this).addClass('checked');
            } else {
                $checkbox[0].click();
                $checkbox.attr('checked', '');
                $(this).removeClass('checked');
            }
            OrderForm.onInputChange.call($checkbox[0]);
			return false;
        });
    },
    hideZeroPriceDoctypes : function()
    {
        $('#doctype tr').show();
        _trs = $('#doctypes_group .doctype_radiolist tr').get();
        j=0;
        for(i = 0; i < _trs.length; i++)
        {
            if($(_trs[i]).find('td.price label').length && $(_trs[i]).find('td.price label').text().match(/\d+/)[0] == 0 )
            {
                $(_trs[i]).css('display', 'none');
            }
            else
            {

                if($(_trs[i]).find('input').length)
                {
                    $(_trs[i]).removeClass('even');
                    if (j%2) {
                        $(_trs[i]).removeClass('odd');
                    } else {
                        $(_trs[i]).addClass('odd');
                    }
                }
                j++;
            }
        }
    },
    offeredFeature : function(inputObj)
    {
        if (OrderForm.isResubmit && !OrderForm.isPreview && OrderForm.adminAuthorized)
        {
            $(inputObj).attr('disabled', 'disabled');
            $('#'+$(inputObj).attr('id')+'_loading').show();

            var loc = location.href;
            loc = loc.substring(0, loc.indexOf('resubmit') + 8) + '.offeredfeature/' + loc.substring(loc.indexOf('resubmit') + 9, loc.indexOf('resubmit') + 17);
            doctype_id = parseInt($(inputObj).attr('id').replace('additional_offered_',''));

            data = {'doctype_id':doctype_id};
            $.ajax({
                type: 'POST',
                url: loc,
                data: data,
                dataType: 'json',
                success: function(data)
                {
                    if (data.success != true)
                    {
                        alert(data.message);
                    }
                    $('#'+$(inputObj).attr('id')+'_loading').hide();
                    $(inputObj).attr('id');
                }
            });
        }
    },
    showLoading : function() {
        OrderForm.resizeFuzz();
        $('input, textarea, select').attr('disabled', 'disabled');
        $('#fuzz').css('display', 'block');
    },
    hideLoading : function() {
        OrderForm.enableInputs();
        $('#fuzz').css('display', 'none');
    },
    enableInputs : function() {
        $('input:not(.disabled_email_input), textarea, select').removeAttr('disabled', 'disabled');
    },
    resizeFuzz : function (){
        $('#fuzz').css("height", $(document).height());
        $('#fuzz').css("width", $(document).width());
    },
    changeURLStep : function (step){
        var location_parts = location.href.split('#');
        if (location_parts.length && step && location_parts[1] != ('block' + step)){
            location.href = location_parts[0] + '#block' + step;
        }
    },
    showBlock : function(index){
        $('.formblock').hide();
        $('.top_text').toggle();
        $('#block'+index).show();

        if (OrderForm.isTranslation)
        {
            $('#step_number' + index).show();
            $('#submit_order_form_step_' + index).show();
        }

        $('html, body').animate({scrollTop:0}, 'slow');
        if (index==1) OrderForm.form_valid = false;
    },
    trackGA : function(page){
        if (typeof page == "undefined") {
            page = 'order_step2';
        }
        try {
            _gaq.push(['_trackPageview',page]);
        } catch(err) {}
    }
};

var FormRules = {

	initialize : function()
        {
            FormRules.initTopicRules();
        },

        initTopicRules : function ()
        {
            $('#topic').keyup(function()
            {
                if (this.value.length == 256)
                {
                    if (!FormRules.issetErrorMaxTopicSymbols())
                    {
                        $('#topic').parent().append('<div id="error_max_symbols" class="validation_error">Maximum 256 symbols allowed</div>');
                        $('#error_max_symbols').css('display','block');
                    }
                }
                else
                {
                    if (FormRules.issetErrorMaxTopicSymbols())
                    {
                        $('#error_max_symbols').remove();
                    }
                }
            });
        },
        issetErrorMaxTopicSymbols : function ()
        {
            if ($('#error_max_symbols').length != 0)
            {
                return true;
            }

            return false;
        }
};

$(document).ready( function() {
	if ( typeof(OrderFormExternalInit) == 'undefined' || OrderFormExternalInit == false )
	{
		OrderFormInit();
	}
})

	var OrderFormInit = function() {
		OrderForm.initialize();
		FormRules.initialize();

        $('#img_add_phone2').click(function(){
            $('#row_phone2').show();
            OrderForm.insertValInOtherObject($('#country'));
            $('#phone2_country').val($('#phone1_country').val());
            $('#img_add_phone2').hide();
            $('#row_phone1 .phone_hint').hide();
        });
        $('#img_delete_phone2').click(function(){
            $('#row_phone2').hide();
            $('#row_phone2').find('input:text').val('');
            $('#row_phone1 .phone_hint').show();
            $('#img_add_phone2').show();
        });

        $('#terms-conditions-popup-leave').click(function(){
            OrderForm.TermConditionPopup.hide();
            return false
        });
        $('#terms-conditions-popup-accept').click(function(){
            OrderForm.TermConditionPopup.accept();
            return false
        });
        $('.offered_feature').click(function(){
            OrderForm.offeredFeature(this);
            return false
        });
        if (OrderForm.switch_to_phone)
        {
            if (OrderForm.isResumes || OrderForm.isTranslation)
            {
                //phone area
                $('#phone1_area').focus(function(){
                    if ($(this).val() == 'area')
                    {
                        $(this).removeClass('phone_default');
                        $(this).val('');
                    }
                    OrderForm.hideValidationFieldError(($('#phone1')));
                })
                $('#phone1_area').blur(function(){
                    if ($(this).val() == '')
                    {
                        $(this).addClass('phone_default');
                        $(this).val('area');
                    }
                    else
                    {
                        if ($('#phone1_number').val() != 'number' && $('#phone1_number').val() != '')
                        {
                            OrderForm.validate(OrderForm.onValidateField($('#phone1')));
                        }
                    }
                })
                //phone number
                $('#phone1_number').focus(function(){
                    if ($(this).val() == 'number')
                    {
                        $(this).removeClass('phone_default');
                        $(this).val('');
                    }
                    OrderForm.hideValidationFieldError(($('#phone1')));
                })
                $('#phone1_number').blur(function(){
                    if ($(this).val() == '')
                    {
                        $(this).addClass('phone_default');
                        $(this).val('number');
                    }
                    else
                    {
                        if ($('#phone1_area').val() != 'area')
                        {
                            OrderForm.validate(OrderForm.onValidateField($('#phone1')));
                        }
                    }
                })
            }
            $('#phone1_area').keyup(function() {
                var input = $(this).val();
                if(input.length == $(this).attr('maxlength')){
                    $('#phone1_area').trigger('change');
                    $('#phone1_number').focus();
                }
            });
            $('#phone2_area').keyup(function() {
                var input = $(this).val();
                if(input.length == $(this).attr('maxlength')){
                    $('#phone2_area').trigger('change');
                    $('#phone2_number').focus();
                }
            });
            $('input[type=number]#phone1_number, input[type=number]#phone2_number').keypress(function() {
                var value = $(this).val();

                if(value.length >= $(this).attr('maxlength')){
                    $(this).val(value.substr(0, $(this).attr('maxlength') - 1));
                }
            });
         }
	}