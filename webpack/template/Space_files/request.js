!function($){"use strict";grn.base.namespace("grn.component.ajax.request"),grn.component.ajax.request=function(settings){this._settings=this._initSettings(settings),this._ajaxDefered=$.Deferred(),this._event=$({}),this.initOnBeforeUnload()},grn.component.ajax.request.EVENT={ERROR_CLOSED:"errorClosed",BEFORE_SHOW_ERROR:"beforeShowError"};var G=grn.component.ajax.request,EVENT=grn.component.ajax.request.EVENT,before_unload_called=false,window_on_beforeunload_registered=false;G.prototype.initOnBeforeUnload=function(){window_on_beforeunload_registered||($(window).on("beforeunload",function(){before_unload_called=true}),window_on_beforeunload_registered=true)},G.prototype.send=function(data){return this._prepareData(data),this._invokeLoadingIndicator("show"),this.jqXHR=$.ajax(this._settings).done(this._ajaxOnSuccess.bind(this)).fail(this._ajaxOnFail.bind(this)).always(this._ajaxOnComplete.bind(this)),this._ajaxDefered.promise()},G.prototype.on=function(name,callback){this._event.on(name,callback)},G.prototype.getErrorHandler=function(){return this._settings.grnErrorHandler},G.prototype.abort=function(){this.jqXHR&&this.jqXHR.abort()},G.prototype._prepareData=function(data){"undefined"===typeof data&&(data=this._settings.data);var local_data=data||{};if(false!==this._settings.processData){switch(typeof local_data){case"object":local_data.use_ajax=1;break;case"string":local_data+="&use_ajax=1";break;default:throw"The given data should be a query string or JSON"}this._settings.data=local_data}else this._settings.data=data},G.prototype._initSettings=function(settings){var garoon_settings={grnErrorHandler:grn.component.ajax.error_handler,grnUrl:null,grnRedirectOnLoginError:false,grnLoadingIndicator:null};this._throwErrorIfUsingUnsupportedOption(settings);var _settings=$.extend(garoon_settings,settings||{});return _settings.grnUrl&&(_settings.url=grn.component.url.page(_settings.grnUrl)),_settings},G.prototype._throwErrorIfUsingUnsupportedOption=function(settings){if("success"in settings||"error"in settings||"complete"in settings)throw"Garoon AJAX component does not support success/error/complete callback options. Use jqXHR.done(), jqXHR.fail(), and jqXHR.always(), jqXHR.then() instead. Refer (The jqXHR Object): http://api.jquery.com/jquery.ajax/"},G.prototype._trigger=function(event_name,data){var $event=$.Event(event_name);return this._event.trigger($event,data||null),$event},G.prototype._ajaxOnSuccess=function(data,textStatus,jqXHR){var error;this._handleError(textStatus,jqXHR)?this._ajaxDefered.rejectWith(this,[jqXHR,textStatus,null]):this._ajaxDefered.resolveWith(this,arguments)},G.prototype._ajaxOnFail=function(jqXHR,textStatus,errorThrown){this._handleError(textStatus,jqXHR),this._ajaxDefered.rejectWith(this,arguments)},G.prototype._ajaxOnComplete=function(){this._invokeLoadingIndicator("hide")},G.prototype._handleError=function(textStatus,jqXHR){var error_handler=this._settings.grnErrorHandler;if("abort"===textStatus||null===error_handler)return false;if(error_handler.hasCybozuLogin(jqXHR)&&this._settings.grnRedirectOnLoginError)location.reload(true);else if("success"!==textStatus||error_handler.hasCybozuError(jqXHR)){var $event;if(!this._trigger(EVENT.BEFORE_SHOW_ERROR,[jqXHR]).isDefaultPrevented()){if(before_unload_called&&!error_handler.hasCybozuError(jqXHR))return;error_handler.show(jqXHR,this._errorPopupClosed.bind(this,jqXHR))}return true}},G.prototype._errorPopupClosed=function(jqXHR){this._trigger(EVENT.ERROR_CLOSED,[jqXHR])},G.prototype._invokeLoadingIndicator=function(option){var indicator=this._settings.grnLoadingIndicator;indicator&&("function"===typeof indicator?indicator(option):$(indicator)[option]())},G._reset=function(){before_unload_called=window_on_beforeunload_registered=false}}(jQuery);