<script id="wasabi-core-modal" type="text/x-handlebars-template">
    <div class="modal-wrapper">
        <div class="{{cssClasses.backdrop}}"></div>
        <div class="{{cssClasses.scrollable}}">
            <div class="{{cssClasses.container}}">
                {{#if hasHeader}}
                    <div class="{{cssClasses.modalHeader}}">
                        <span>{{{modalHeader}}}</span>
                        {{#if hasCloseLink}}
                            <a href="javascript:void(0)" data-dismiss="modal"><i class="icon-delete"></i></a>
                        {{/if}}
                    </div>
                {{/if}}

                {{#if hasBody}}
                    <div class="{{cssClasses.modalBody}}">
                        {{{modalBody}}}
                    </div>
                {{/if}}

                {{#if hasFooter}}
                    <div class="{{cssClasses.modalFooter}}{{#if isConfirmModal}} {{cssClasses.confirmFooter}}{{/if}}">
                        <form action="{{action}}" method="{{method}}">
                            {{#if isConfirmModal}}
                                <button class="button" type="submit"><span>{{confirmYes}}</span></button>
                                <a href="javascript:void(0)" data-dismiss="modal">{{confirmNo}}</a>
                            {{/if}}
                        </form>
                    </div>
                {{/if}}
            </div>
        </div>
    </div>
</script>
