<style>
</style>
<template>
    <div v-modal v-if="open" class="modal fade {{modalClass}}">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 class="modal-title"><i class="{{modalIcon}}"></i> {{title}}</h4>
        </div>
        <div class="modal-body">
            <slot></slot>
        </div>
        <div class="modal-footer">
            <button v-if="showCancel" type="button" data-dismiss="modal" class="btn btn-outline dark">{{cancelText}}
            </button>
            <button v-if="showSubmit" type="button" v-on:click="btnSubmit" class="btn green">{{submitText}}</button>
        </div>
    </div>
</template>
<script>
import "jquery-validation"

export default {
    props: {
        modalIcon: {
            type: String,
            default: 'icon-grid'
        },
        modalClass: {
            type: String,
            default: function() {
                return null
            }
        },
        cancelText: {
            type: String,
            default: function() {
                return "取消"
            }
        },
        submitText: {
            type: String,
            default: function() {
                return "确认"
            }
        },
        showSubmit: {
            type: Boolean,
            default: true
        },
        showCancel: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ""
        },
        open: {
            type: Boolean,
            default: false
        },
        onConfirm: Function
    },
    directives: {
        'modal': {
            bind: function() {
                var self = this;
                $(this.el).modal({}).on('hide.bs.modal', function(e) {
                    if (e.target === this) {
                        self.vm.open = false;
                    }
                });

                if ($(this.el).find('form').length > 0) {
                    $.extend($.validator.messages, {
                        required: "必填字段",
                        remote: "请修正该字段",
                        email: "请输入正确格式的电子邮件",
                        url: "请输入合法的网址",
                        date: "请输入合法的日期",
                        dateISO: "请输入合法的日期 (ISO).",
                        number: "请输入合法的数字",
                        digits: "只能输入整数",
                        creditcard: "请输入合法的信用卡号",
                        equalTo: "请再次输入相同的值",
                        accept: "请输入拥有合法后缀名的字符串",
                        maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
                        minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
                        rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
                        range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
                        max: $.validator.format("请输入一个最大为 {0} 的值"),
                        min: $.validator.format("请输入一个最小为 {0} 的值")
                    });
                    //checklist 最少选择项
                    $.validator.addMethod("checklist-min", function(value, element, params) {
                        var $element = $(element),
                            $parent = $element.parents('.checkbox-list').eq(0);
                        var chkCount = 0;
                        $parent.find('input[type="checkbox"]').each(function(idx, obj) {
                            if ($(obj).prop('checked')) {
                                chkCount++;
                            }
                        });
                        if (chkCount >= params) {
                            return true;
                        } else {
                            return false;
                        }
                    }, $.validator.format("最少选择{0}项"));
                    $.validator.addMethod("image-min", function(value, element, params) {
                        var $element = $(element),
                            currentCount = $element.siblings('ul').find('li.item-dragdrop').size();
                        if (currentCount >= params) {
                            return true;
                        } else {
                            return false;
                        }
                    }, $.validator.format("最少上传{0}张图片"));
                    $.validator.addMethod("image-max", function(value, element, params) {
                        var $element = $(element),
                            currentCount = $element.siblings('ul').find('li.item-dragdrop').size();
                        if (currentCount <= params) {
                            return true;
                        } else {
                            return false;
                        }
                    }, $.validator.format("最多上传{0}张图片"));

                    $(this.el).find('form').eq(0).validate({
                        debug: false,
                        errorElement: 'span',
                        errorClass: 'help-block help-error',
                        focusInvalid: true,
                        ignore: ".ignore",
                        invalidHandler: function(event, validator) { //display error alert on form submit
                        },
                        errorPlacement: function(error, element) { // render error placement for each input type
                            if (element.parent(".input-group").size() > 0) {
                                error.insertAfter(element.parent(".input-group"));
                            } else if (element.parents('.radio-list').size() > 0) {
                                error.appendTo(element.parents('.radio-list').attr("data-error-container"));
                            } else if (element.parents('.radio-inline').size() > 0) {
                                error.appendTo(element.parents('.radio-inline').attr("data-error-container"));
                            } else if (element.parents('.checkbox-list').size() > 0) {
                                error.insertAfter(element.parents('.checkbox-list'));
                            } else if (element.parents('.checkbox-inline').size() > 0) {
                                error.appendTo(element.parents('.checkbox-inline').attr("data-error-container"));
                            }
                            //                    else if (element.parents('.components_map').size() > 0) {
                            //                        error.insertAfter(element.parents('.components_map'));
                            //                    }
                            else if (element.parents('.components_imageupload').size() > 0) {
                                error.insertAfter(element.parents('.components_imageupload'));
                            }
                            // else if (element.hasClass('components_tags')) {
                            //                        error.insertAfter(element.siblings('.tagsinput'));
                            //                    } else if (element.hasClass('components_multiselect')) {
                            //                        error.insertAfter(element.siblings('.ms-container'));
                            //                    }
                            else {
                                error.insertAfter(element); // for other inputs, just perform default behavior
                            }
                        },
                        highlight: function(element) {
                            $(element).closest('.form-group').addClass('has-error');
                        },
                        unhighlight: function(element) {
                            $(element).closest('.form-group').removeClass('has-error');
                        },
                        success: function(label) {
                            label.closest('.form-group').removeClass('has-error'); // set success class to the control group
                        }
                    });
                }
            },
            unbind: function() {
                $(this.el).modal('hide');
            }
        }
    },
    data() {
        return {
            control: null,
        }
    },
    ready() {

    },
    methods: {
        show: function() {
            this.open = true;
        },
        hide: function() {
            $(this.$el).modal('hide');
            this.open = false;
        },
        btnSubmit: function() {
            if (this.onConfirm) {
                this.onConfirm(this);
            }
        }
    },
    events: {},
    components: {}
}
</script>
