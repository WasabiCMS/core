define("common/BaseViewFactory",["require","underscore"],function(t){var e=t("underscore"),i=function(t){this.eventBus=t,this.registry={factory:this}};return i.prototype=e.extend({},{register:function(t,e){return this.registry[t]=e,this.registry[t]},create:function(t,i){var o,s;return i=i||{},s=e.extend(i,this.registry,{eventBus:this.eventBus}),o=t,o.prototype.eventBus=this.eventBus,new o(s)}}),i}),define("wasabi",["require","jquery","underscore","backbone","./common/BaseViewFactory","bootstrap.dropdown"],function(t){var e=t("jquery"),i=t("underscore"),o=t("backbone"),s=t("./common/BaseViewFactory");t("bootstrap.dropdown");var n=i.extend({},o.Events),a=new s(n),l=0,r="undefined";if(typeof window.WS!==r)return window.WS;var d={features:{},modules:{registered:[]},initialized:!1,messages:{},views:[],eventBus:n,viewFactory:a,boot:function(){function i(e){var i=e.name,s=e.require,n=e.options;"undefined"==typeof o.modules[i]&&(o.modules[i]=i,t([s],function(t){o.modules[i]=t,o.modules[i].initialize(n)}))}for(var o=this,s=0,n=this.modules.registered.length;n>s;s++)i(this.modules.registered[s]);this.initialized||e(window).on("resize",function(){clearTimeout(l),l=setTimeout(function(){d.eventBus.trigger("window.resize")},100)})},registerModule:function(t,e){this.modules.registered.push({name:t,require:t,options:e||{}})},get:function(t){return this.modules[t]?this.modules[t]:void console.debug('module "'+t+" is not registered.")},createView:function(t,e){return this.viewFactory.create(t,e||{})},createViews:function(t,e,o){var s=[];return t.length>0&&t.each(function(t,n){s.push(d.createView(e,i.extend({el:n},o||{})))}),s},blockElement:function(t,i){i=e.extend({},{deltaWidth:0,deltaHeight:0,backgroundColor:"#fff",opacity:.6,cursor:"wait",zIndex:9997,whiteSpinner:!1},i);var o=e('<div class="block-backdrop"><div class="spinner"></div></div>'),s=t.offset(),n=t.css("borderLeftWidth"),a=t.css("borderTopWidth"),l=t.innerWidth()+i.deltaWidth,r=t.innerHeight()+i.deltaHeight;""!==n&&(n=parseInt(n.split("px")[0]),s.left+=n),""!==a&&(a=parseInt(a.split("px")[0]),s.top+=a),o.css({position:"absolute",top:0,left:0,width:l,height:r,backgroundColor:i.backgroundColor,opacity:i.opacity,cursor:i.cursor,zIndex:i.zIndex}).hide().appendTo(t),i.whiteSpinner&&o.find(".spinner").addClass("spinner-white"),o.fadeIn(100,function(){o.on("mousedown mouseup keydown keypress keyup touchstart touchend touchmove",this.handleBlockedEvent)})},unblockElement:function(t,e){e=e||function(){},this.spinner&&this.spinner.stop(),t.find(".block-backdrop").off("mousedown mouseup keydown keypress keyup touchstart touchend touchmove",this.handleBlockedEvent).remove(),"function"==typeof e&&e.call(this)},handleBlockedEvent:function(t){t.preventDefault(),t.stopPropagation()}};return window.WS=d,d}),define("core/views/Menu",["require","jquery","common/BaseView","wasabi","bootstrap.collapse"],function(t){var e=t("jquery"),i=t("common/BaseView");t("wasabi");t("bootstrap.collapse");var o={collapsedClass:"collapsed",openClass:"open",selectedClass:"popout"},s=function(t,i){var o=e(t.target);return o.is("li")?o:(i=i||"",o.closest("li"+i))};return i.extend({el:"#backend-menu > ul",events:{"click > li:has(ul) > a":"onMainItemClick"},globalEvents:{"window.resize":"onWindowResize"},isCollapsed:!1,options:{},$window:null,$document:null,$wrap:null,isIOS:/iPhone|iPad|iPod/.test(navigator.userAgent),menuIsPinned:!1,pinnedMenuTop:!1,pinnedMenuBottom:!1,lastScrollPosition:0,initialize:function(t){this.options=e.extend({},o,t),this.$("> li").filter(".active").prev().addClass("prev-active"),this.$window=e(window),this.$document=e(document),this.$wrap=this.$el.parent().parent(),this.lastScrollPosition=this.$window.scrollTop(),this.$window.on("scroll",_.bind(this.pinMenu,this)),this.collapseMenu(),this.pinMenu()},onWindowResize:function(t){this.collapseMenu(),this.pinMenu()},collapseMenu:function(){var t=window.getComputedStyle(document.querySelector("#backend-menu"),"::before").getPropertyValue("content").replace(/'/g,"").replace(/"/g,"");this.isCollapsed="collapsed"===t,this.$el.toggleClass(this.options.collapsedClass,this.isCollapsed),this.isCollapsed||this.$el.find("."+this.options.selectedClass).removeClass(this.options.selectedClass).find(".sub-nav").css({marginTop:""})},onMainItemClick:function(t){var i=s(t);if(0!==i.find(".sub-nav").length){t.preventDefault(),t.stopPropagation();var o=this.$("."+this.options.selectedClass).filter(function(){return e(this)[0]!==i[0]});if(o.removeClass(this.options.selectedClass),this.isCollapsed){var n=i.find(".sub-nav");n.css({marginTop:"",height:""}),i.hasClass(this.options.selectedClass)?(i.removeClass(this.options.selectedClass),this.$document.off("click",_.bind(this.hideSubnav,this))):(i.addClass(this.options.selectedClass),this.adjustPopoutMenu(i),this.$document.on("click",_.bind(this.hideSubnav,this)))}else i.hasClass(this.options.openClass)?(i.removeClass(this.options.openClass),i.find(".sub-nav").collapse("hide")):(i.addClass(this.options.openClass),i.find(".sub-nav").collapse("show"))}},hideSubnav:function(t){var e=s(t);if(0===e.parents("."+this.options.selectedClass).length){var i=this.$("."+this.options.selectedClass);i.removeClass(this.options.selectedClass),i.find(".sub-nav").css("margin-top","")}},adjustPopoutMenu:function(t){var e,i=t.find(".sub-nav"),o=i.offset();if(o){var s=o.top,n=i.outerHeight(),a=this.$window.height();s+n>a&&(e=s+n-a-this.$window.scrollTop())}e>1?i.css("margin-top","-"+e+"px"):i.css("margin-top","")},pinMenu:function(t){var i,o=this.$window.scrollTop(),s=!t||"scroll"!==t.type;if(!this.isIOS){var n=e("#page-header").outerHeight(),a=this.$el.outerHeight(),l=this.$window.height(),r=this.$document.height();if(l>a+n)return void this.unpinMenu();if(this.menuIsPinned=!0,a+n>l){if(0>o)return void(this.pinnedMenuTop||(this.pinnedMenuTop=!0,this.pinnedMenuBottom=!1,this.$wrap.css({position:"fixed",top:"",bottom:""})));if(o+l>r-1)return void(this.pinnedMenuBottom||(this.pinnedMenuBottom=!0,this.pinnedMenuTop=!1,this.$wrap.css({position:"fixed",top:"",bottom:0})));o>this.lastScrollPosition?this.pinnedMenuTop?(this.pinnedMenuTop=!1,i=this.$wrap.offset().top-n-(o-this.lastScrollPosition),o+l>i+a+n&&(i=o+l-a-n),this.$wrap.css({position:"absolute",top:i,bottom:""})):!this.pinnedMenuBottom&&this.$wrap.offset().top+a<o+l&&(this.pinnedMenuBottom=!0,this.$wrap.css({position:"fixed",top:"",bottom:0})):o<this.lastScrollPosition?this.pinnedMenuBottom?(this.pinnedMenuBottom=!1,i=this.$wrap.offset().top-n+(this.lastScrollPosition-o),i+a>o+l&&(i=o),this.$wrap.css({position:"absolute",top:i,bottom:""})):!this.pinnedMenuTop&&this.$wrap.offset().top>=o+n&&(this.pinnedMenuTop=!0,this.$wrap.css({position:"fixed",top:"",bottom:""})):s&&(this.pinnedMenuTop=this.pinnedMenuBottom=!1,i=o+l-a-n-1,i>0?this.$wrap.css({position:"absolute",top:i,bottom:""}):this.unpinMenu())}this.lastScrollPosition=o}},unpinMenu:function(){!this.isIOS&&this.menuIsPinned&&(this.pinnedMenuTop=this.pinnedMenuBottom=this.menuIsPinned=!1,this.$wrap.css({position:"",top:"",bottom:""}))}})}),define("core/views/NavigationToggle",["require","jquery","common/BaseView"],function(t){var e=t("jquery"),i=t("common/BaseView"),o=e("body"),s={forceOpenClass:"backend-nav--is-visible"};return i.extend({el:"#page-header .nav-toggle",events:{click:"toggleNav"},options:{},initialize:function(t){this.options=e.extend({},s,t)},toggleNav:function(){o.hasClass(this.options.forceOpenClass)?o.removeClass(this.options.forceOpenClass):o.addClass(this.options.forceOpenClass)}})}),define("core/views/LangSwitch",["require","underscore","common/BaseView"],function(t){var e=t("underscore"),i=t("common/BaseView");return i.extend({el:".lang-switch",globalEvents:{"wasabi-core--languages-sort":"updateLanguageLinkPositions"},updateLanguageLinkPositions:function(t,i){var o=i.frontendLanguages,s=[],n=this.$("li");e.each(o,function(t){s.push(n.filter('[data-language-id="'+t.id+'"]'))}),this.$el.html(s)}})}),define("core/views/Pagination",["require","jquery","common/BaseView","purl"],function(t){var e=t("jquery"),i=t("common/BaseView"),o=t("purl");return i.extend({el:".pagination",events:{"change .limit":"onChangeLimit"},onChangeLimit:function(t){var i=e(t.target),s=i.val(),n=i.attr("data-url"),a=o(window.location),l=i.attr("name").split("data[").join("").split("]").join(""),r=a.data.param.query;r[l]=s.toString();var d="",c=[];for(var h in r)r.hasOwnProperty(h)&&c.push(h+"="+r[h]);d=c.join("&"),""!==d&&(d="?"+d),window.location=n+d}})}),define("core/views/LoginModal",["require","underscore","jquery","common/BaseView","wasabi"],function(t){var e=t("underscore"),i=t("jquery"),o=t("common/BaseView"),s=t("wasabi");return o.extend({template:"",isOpen:!1,events:{"submit form":"onSubmit"},initialize:function(){this.template=e.template(i("#wasabi-core-login-modal").html()),this.$body=i("body")},openModal:function(){this.isOpen||(this.isOpen=!0,this.$body.addClass("modal-open"),this.$modal=i(this.template()),this.setElement(this.$modal),this.$button=this.$("button"),this.$modal.appendTo(this.$body),this.$("#email").focus())},onSubmit:function(t){t.preventDefault();var o=this.$("form");this.$button.prepend('<span class="spinner spinner-white"></span>').attr("disabled","disabled"),i.ajax({url:o.attr("action"),data:o.serialize(),method:"post",success:e.bind(function(t){t.content?(this.$(".modal-body").html(t.content),this.$("#email").focus(),this.$button.find(".spinner").remove(),this.$button.attr("disabled","").prop("disabled",!1)):t.redirect||(this.closeModal(),s.get("wasabi.core").initHeartBeat())},this)})},closeModal:function(){i.when.apply(null,[this.$(".modal-container").fadeOut(200),this.$(".modal-backdrop").fadeOut(200)]).then(i.proxy(function(){this.$modal&&this.$modal.remove(),this.$body.removeClass("modal-open"),this.isOpen=!1},this))}})}),define("common/ModalView",["require","jquery","underscore","common/BaseView","wasabi"],function(t){var e=t("jquery"),i=t("underscore"),o=t("common/BaseView"),s=t("wasabi"),n=e("body"),a=e(document),l=e(window),r={width:400,offsetTop:200,opacity:.35,padding:20,cssClasses:{backdrop:"modal-backdrop",scrollable:"modal-scrollable",container:"modal-container",modalHeader:"modal-header",modalBody:"modal-body",modalFooter:"modal-footer",confirmFooter:"modal-confirm"},confirmYes:"Yes",confirmNo:"No",closeOnScrollable:!0,closeOnSubmit:!0};return o.extend({template:"",$backdrop:null,$container:null,$closeButtons:null,$modal:null,$notify:null,$scrollable:null,$submitButtons:null,events:{click:"openModal"},globalEvents:{"window.resize":"onResize"},modalName:null,isConfirmModal:!1,isOpened:!1,method:null,modalSuccessEvent:null,options:{},initialize:function(t){this.options=e.extend({},r,t),this.template=i.template(e("#wasabi-core-modal").html())},initModalOptions:function(){if(this.method=this.$el.attr("data-modal-method")||"post",this.isAjax="1"===this.$el.attr("data-modal-ajax")||"true"===this.$el.attr("data-modal-ajax"),this.action=this.$el.attr("data-modal-action")||this.$el.attr("href")||!1,this.isAjax){var t=this.$el.attr("data-modal-notify");this.$notify=void 0!==t?e(t):a,this.modalSuccessEvent=this.$el.attr("data-modal-event")||"modal:success"}var i=parseInt(this.$el.attr("data-modal-width"));i&&(this.options.width=i),"undefined"!=typeof this.$el.attr("data-modal-close-on-scrollable")&&(this.options.closeOnScrollable=parseInt(this.$el.attr("data-modal-close-on-scrollable"))),"undefined"!=typeof this.$el.attr("data-modal-close-on-submit")&&(this.options.closeOnSubmit=parseInt(this.$el.attr("data-modal-close-on-submit"))),this.options.forceCloseModalLink=parseInt(this.$el.attr("data-force-close-modal-link"))},createTemplateOptions:function(){var t,i,o={};return o.modalHeader=this.$el.attr("data-modal-header")||this.options.modalHeader,o.hasHeader=void 0!==o.modalHeader,o.modalBody=this.$el.attr("data-modal-body")||this.options.modalBody,o.hasBody=void 0!==o.modalBody,o.hasBody||(i=e(this.$el.attr("data-modal-target")),t=i.length>0,t&&(o.modalBody=i.html(),o.hasBody=!0)),o.isConfirmModal="confirm"===this.$el.attr("data-toggle"),o.isConfirmModal?o.hasFooter=!0:(o.modalFooter=this.$el.attr("data-modal-footer"),o.hasFooter=void 0!==o.modalFooter),o.action=this.action,o.method=this.method,o.cssClasses=this.options.cssClasses,o.confirmYes=this.options.confirmYes,o.confirmNo=this.options.confirmNo,o.forceCloseModalLink=this.options.forceCloseModalLink,o.hasCloseLink=!o.isConfirmModal||o.forceCloseModalLink,o},initModalElements:function(){this.$modal=e(this.template(this.createTemplateOptions())),this.$backdrop=this.$modal.find("."+this.options.cssClasses.backdrop),this.$backdrop.css({opacity:this.options.opacity}),this.$scrollable=this.$modal.find("."+this.options.cssClasses.scrollable),this.$container=this.$modal.find("."+this.options.cssClasses.container),this.$container.css({width:this.options.width,position:"fixed",left:-99999,top:this.options.offsetTop,opacity:0,zIndex:1e4}),this.$closeButtons=this.$modal.find('[data-dismiss="modal"]'),this.$submitButtons=this.$modal.find('button[type="submit"]')},updatePosition:function(){var t=this.$container.outerHeight(),e=this.$container.offset().top-this.$scrollable.offset().top,i=this.$scrollable.height(),o=i-t-e<this.options.offsetTop;l.height()<a.height()?n.addClass("page-overflow").addClass("fix-scroll-"+this.options.scrollbarWidth):n.removeClass("page-overflow").removeClass("fix-scroll-"+this.options.scrollbarWidth),o?t+2*this.options.padding<=i?this.$container.css({top:"50%",marginTop:-t/2}):this.$container.css({top:this.options.padding,marginTop:0}):this.$container.css({top:this.options.offsetTop,marginTop:0}),this.$container.css({position:"absolute",marginLeft:-this.options.width/2,left:"50%"})},resetDOM:function(){n.removeClass("modal-open").removeClass("page-overflow"),this.$modal=null,this.$container=null,this.$scrollable=null,this.$backdrop=null,this.$submitButtons=[]},onResize:function(){this.isOpened&&this.updatePosition()},submit:function(t){var i=e(t.target),o=this;if(void 0===i.attr("disabled"))if(this.isAjax){t.preventDefault(),i.prop("disabled",!0),this.$notify.trigger("modal:beforeAjax");var n,a=this.$modal.find("form");a.length>0&&(n=this.$modal.find("form").serialize()),e.ajax({type:this.method,url:this.action,cache:!1,data:n,success:function(t){o.closeModal(),o.$notify.trigger(o.modalSuccessEvent,t)}})}else this.modalName&&s.eventBus.trigger("modal-submitted-"+this.modalName,this,t),this.options.closeOnSubmit&&this.closeModal()},openModal:function(t){if(t&&t.preventDefault(),!this.isOpened&&!this.$el.hasClass("disabled")){if(this.isOpened=!0,this.initModalOptions(),this.initModalElements(),n.addClass("modal-open"),this.$modal.appendTo(n),this.updatePosition(),this.$container.hide().css("opacity",1).fadeIn(),this.$closeButtons.length>1)for(var o=0,a=this.$closeButtons.length;a>o;o++)e(this.$closeButtons[o]).on("click",i.bind(this.closeModal,this));else this.$closeButtons.on("click",i.bind(this.closeModal,this));this.options.closeOnScrollable&&this.$scrollable.on("click",i.bind(this.closeModal,this)),this.$submitButtons.length&&this.$submitButtons.on("click",i.bind(this.submit,this)),this.modalName=this.$el.attr("data-modal-name"),this.modalName&&(this.$modal.attr("data-modal-name",this.modalName),s.eventBus.trigger("modal-opened-"+this.modalName,this))}},closeModal:function(t){if("object"==typeof t){if(t.target!==t.currentTarget&&e(t.target).parent()[0]!==t.currentTarget)return;t.preventDefault()}if(this.$closeButtons.length>1)for(var o=0,s=this.$closeButtons.length;s>o;o++)e(this.$closeButtons[o]).off("click",i.bind(this.closeModal,this));else this.$closeButtons.off("click",i.bind(this.closeModal,this));this.options.closeOnScrollable&&this.$scrollable.off("click",i.bind(this.closeModal,this)),this.$submitButtons.length&&this.$submitButtons.off("click",i.bind(this.submit,this)),this.unblockThis(),e.when.apply(null,[this.$container.fadeOut(200),this.$backdrop.fadeOut(200)]).then(e.proxy(function(){this.$modal&&this.$modal.remove(),this.resetDOM(),this.isOpened=!1,"function"==typeof t&&t.call()},this))}})}),define("common/TabView",["require","jquery","common/BaseView"],function(t){var e=t("jquery"),i=t("common/BaseView");return i.extend({events:{"click li":"onClick","click a":"onClick"},initialize:function(){this.tabifyId=this.$el.attr("data-tabify-id"),this.$listItems=this.$("> li"),this.$tabs=e("div[data-tabify-tab]").filter('[data-tabify-id="'+this.tabifyId+'"]');var t=window.location.hash.split("#")[1]||null,i=this.$listItems.filter('[data-tabify-target="'+t+'"]:not([data-tabify-disabled="1"])');i.length>0?i.find("a").trigger("click"):this.$listItems.first().addClass("active")},onClick:function(t){t.preventDefault();var i=e(t.target);if(i.is("a")&&(i=i.parent()),!i.is("li"))return!1;var o=i.attr("data-tabify-target"),s=i.attr("data-tabify-disabled");return"undefined"!=typeof s&&"1"===s?!1:(this.$listItems.removeClass("active"),this.$tabs.removeClass("active").hide(),this.$tabs.filter('[data-tabify-tab="'+o+'"]').addClass("active").show(),window.history.replaceState(null,null,"#"+o),void i.addClass("active"))}})}),define("core/views/LanguagesTable",["require","jquery","common/BaseView","wasabi","jquery.tSortable"],function(t){var e=t("jquery"),i=t("common/BaseView"),o=t("wasabi");return t("jquery.tSortable"),i.extend({events:{"tSortable-change":"onSort"},initialize:function(t){this.$form=this.$el.closest("form"),this.$el.tSortable({handle:"a.action-sort",placeholder:"sortable-placeholder",opacity:.8})},onSort:function(t){var i=e(t.target);i.find("tbody > tr").each(function(t){e(this).find("input.position").first().val(t)}),e.ajax({url:this.$form.attr("action"),data:this.$form.serialize(),type:"post",success:function(e){o.eventBus.trigger("wasabi-core--languages-sort",t,e)}})}})}),define("core/sections/LanguagesIndex",["require","common/BaseView","wasabi","../views/LanguagesTable"],function(t){var e=t("common/BaseView"),i=t("wasabi"),o=t("../views/LanguagesTable");return e.extend({el:".wasabi-core--languages-index",initialize:function(t){i.createView(o,{el:this.$("table.languages")})}})}),define("core/sections/GroupPermissionsIndex",["require","jquery","common/BaseView","jquery.color"],function(t){var e=t("jquery"),i=t("common/BaseView");return t("jquery.color"),i.extend({el:".wasabi-core--grouppermissions-index",events:{"click .single-submit":"onSingleSubmit"},onSingleSubmit:function(t){t.preventDefault();var i=e(t.target),o=e('<div class="spinner"/>');i.hide().blur().parent().append(o),e.ajax({type:"post",url:this.$(".permissions-update-form").attr("action"),data:i.parent().parent().find("input").serialize(),dataType:"json",cache:!1,success:function(){var t=i.parent().parent(),s=i.parent().css("backgroundColor");o.remove(),i.show(),t.find("td:not(.controller)").stop().css({backgroundColor:"#fff7d9"}).animate({backgroundColor:s},1e3,function(){e(this).css({backgroundColor:""})})}})}})}),define("wasabi.core",["require","jquery","underscore","core/views/Menu","core/views/NavigationToggle","core/views/LangSwitch","core/views/Pagination","core/views/LoginModal","common/ModalView","common/TabView","wasabi","jquery.livequery","core/sections/LanguagesIndex","core/sections/GroupPermissionsIndex"],function(t){function e(){m.ajaxSetup({dataType:"json",beforeSend:f.bind(function(t,e){e.heartBeat||p.call(this)},this)}),m(k).ajaxSuccess(f.bind(i,this)).ajaxError(f.bind(o,this))}function i(t,e){if(200==e.status&&"OK"==e.statusText){var i=e.getResponseHeader("Content-Type");if(2===i.split("application/json").length){var o=m.parseJSON(e.responseText)||{};"undefined"!=typeof o.status&&("undefined"!=typeof o.flash&&n(o.flash),"undefined"!=typeof o.redirect&&(M.location=o.redirect))}}}function o(t,e){var i;401==e.status&&(i=m.parseJSON(e.responseText)||{},"undefined"!=typeof i.name&&(confirm(i.name)?M.location.reload():M.location.reload())),403==e.status&&u.call(this),500==e.status&&(i=m.parseJSON(e.responseText)||{},"undefined"!=typeof i.name&&n({before:"div.title-pad","class":"error",message:i.name}))}function s(){function t(){var t=m("<div/>").css({width:"100px",height:"100px",overflow:"scroll",position:"absolute",top:"-9999px"}),e=m("body");t.prependTo(e);var i=0;return setTimeout(function(){i=t[0].offsetWidth-t[0].clientWidth},0),t.remove(),i}B.features.scrollbarWidth=t()}function n(t){var e=t.before||!1,i=t.after||!1,o=t.message,s=t["class"]?"flash-"+t["class"]:"flash-success",n=!1,a=m("<div/>").addClass(s).html(o);e?(n=m(e),n.prev("."+s).remove(),a.insertBefore(n)):i&&(n=m(i),n.next("."+s).remove(),a.insertAfter(n))}function a(){B.views.menu=B.createView(b),B.views.navigationToggle=B.createView(v),B.views.langSwitch=B.createView(g),B.views.paginations=B.createViews(m(".pagination"),w)}function l(){m("select").livequery(function(){m(this).toggleClass("empty",""===m(this).val()),m(this).change(function(){m(this).toggleClass("empty",""===m(this).val())})})}function r(){var t=this;B.views.modals=[],m('[data-toggle="modal"], [data-toggle="confirm"]').livequery(function(){B.views.modals.push(B.createView(y,{el:m(this),scrollbarWidth:B.features.scrollbarWidth,confirmYes:t.options.translations.confirmYes,confirmNo:t.options.translations.confirmNo}))})}function d(){m(".tabs[data-tabify-id]").livequery(function(){B.views.push(B.createView(C,{el:m(this)}))})}function c(){this.$body.hasClass("wasabi-core--languages-index")&&B.createView(t("core/sections/LanguagesIndex")),this.$body.hasClass("wasabi-core--grouppermissions-index")&&B.createView(t("core/sections/GroupPermissionsIndex"))}function h(t){401===t.status?u.call(this):p.call(this)}function u(){clearTimeout(this.heartBeatTimeout),this.loginModal.openModal()}function p(){this.loginModal||(this.loginModal=B.createView($,{})),clearTimeout(this.heartBeatTimeout),this.heartBeatTimeout=setTimeout(f.bind(function(){m.ajax({url:this.options.heartbeatEndpoint,method:"post",type:"json",success:f.bind(h,this),error:f.bind(u,this),heartBeat:!0})},this),this.options.heartbeat)}var m=t("jquery"),f=t("underscore"),b=t("core/views/Menu"),v=t("core/views/NavigationToggle"),g=t("core/views/LangSwitch"),w=t("core/views/Pagination"),$=t("core/views/LoginModal"),y=t("common/ModalView"),C=t("common/TabView"),B=t("wasabi");t("jquery.livequery");var M=window,k=document;return{options:{},w:null,d:null,$html:null,$body:null,views:[],collections:[],models:[],heartBeatTimeout:0,resizeTimeout:0,components:{},loginModal:null,initialize:function(t){this.options=t||{},this.w=M,this.d=k,this.$html=m("html"),this.$body=m("body"),e.call(this),s.call(this),a.call(this),l.call(this),r.call(this),d.call(this),c.call(this),p.call(this)},initHeartBeat:function(){p.call(this)}}});