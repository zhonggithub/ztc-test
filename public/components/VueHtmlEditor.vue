<style>
@import "../global/plugins/summernote/dist/summernote.css";
@import "../../node_modules/codemirror/lib/codemirror.css";
@import "../../node_modules/codemirror/theme/monokai.css";
</style>
<template>
    <div class="form-group ignore">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div v-summernote="value" class="summernote"></div>
            <input type="hidden" name="{{fieldName}}" v-model="value">
            <span class="help-block">{{tips}}</span>
        </div>
    </div>
</template>
<script>
import "../global/plugins/summernote/dist/summernote"
import "../global/plugins/summernote/dist/lang/summernote-zh-CN"
import "../../node_modules/codemirror/mode/xml/xml"

export default {
    props: {
        labelName: {
            type: String,
            required: true,
            default: ''
        },
        fieldName: {
            type: String,
            default: function() {
                return "fieldName_" + (new Date()).getTime();
            }
        },
        tips: {
            type: String,
            default: ""
        },
        value: {
            type: String,
            twoWay: true
        },
        language: {
            type: String,
            required: false,
            default: "zh-CN"
        },
        height: {
            type: Number,
            required: false,
            default: 360
        },
        minHeight: {
            type: Number,
            required: false,
            default: 160
        },
        maxHeight: {
            type: Number,
            required: false,
            default: 800
        },
        toolbar: {
            type: Array,
            required: false,
            default: function() {
                return [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'hr', 'video']],
                    ['view', ['fullscreen', 'codeview']],
                    ['help', ['help']]
                ];
            }
        }
    },
    beforeCompile: function() {
        this.isChanging = false;
        this.control = null;
    },
    data() {
        return {
            isChanging: false,
            control: null
        }
    },
    directives: {
        'summernote': {
            twoWay: true,
            bind: function() {
                var self = this;
                if (self.vm.minHeight > self.vm.height) {
                    self.vm.minHeight = self.vm.height;
                }

                if (self.vm.maxHeight < self.vm.height) {
                    self.vm.maxHeight = self.vm.height;
                }

                self.vm.isChanging = false;
                self.vm.control = null;

                self.vm.control = $(this.el);
                self.vm.$nextTick(function() {
                    $(self.el).summernote({
                        lang: self.vm.language,
                        height: self.vm.height,
                        minHeight: self.vm.minHeight,
                        maxHeight: self.vm.maxHeight,
                        toolbar: self.vm.toolbar,
                        codemirror: {
                            mode: 'text/html',
                            htmlMode: true,
                            lineNumbers: true,
                            theme: 'monokai'
                        },
                        callbacks: {
                            onInit: function() {
                                $(this).summernote('code', self.vm.value);
                                $('.note-editor').find('.modal').addClass('bootbox');
                            },
                            onFocus: function() {},
                            onBlur: function() {},
                            onChange: function(contents) {
                                if (!self.vm.isChanging) {
                                    self.vm.isChanging = true;
                                    //                                        self.vm.value = contents;
                                    self.set(contents);
                                    self.vm.isChanging = false;
                                }
                            }
                        }

                    });
                });


            },
            unbind: function() {}
        }
    },
    watch: {
        "model": function(val, oldVal) {
            if (!this.isChanging) {
                this.isChanging = true;
                //                    $(this.control).trigger("summernote.change");
                this.isChanging = false;
            }
        }
    },
    ready() {

    },
    components: {}
}
</script>
