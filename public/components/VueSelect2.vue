<style>
@import "../../node_modules/select2/dist/css/select2.min.css";
@import "../global/plugins/select2/css/select2-bootstrap.min.css";
</style>
<template>
    <div class="form-group">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <select v-select2="value" name="{{fieldName}}" class="form-control input-medium">
            </select>
            <span class="help-block">{{tips}}</span>
        </div>
    </div>
</template>
<script>
import "select2"
import "select2/dist/js/i18n/zh-CN"
import _ from "lodash"
export default {
    props: {
        labelName: {
            type: String,
            default: "",
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
        required: {
            type: String,
            default: "false"
        },
        placeholder: {
            type: String,
            default: ""
        },
        value: {
            type: String,
            twoWay: true,
            default: ""
        },
        url: {
            type: String,
            default: ""
        }
    },
    computed: {},
    data() {
        return {
            ctl: null
        }
    },
    directives: {
        'select2': {
            twoWay: true,
            bind: function() {
                var self = this;

                var _options = _.defaults({}, {
                    language: 'zh-CN'
                });

                if (this.vm.url != '') {
                    _options = _.defaults({
                        minimumInputLength: 1,
                        ajax: {
                            url: this.vm.url,
                            dataType: 'json',
                            delay: 250,
                            data: function(params) {
                                return {
                                    q: params.term, // search term
                                    page: params.page
                                };
                            },
                            processResults: function(data, page) {
                                var result = [];
                                if (data && data.data) {
                                    result = data.data
                                }

                                return {
                                    results: result
                                };
                            },
                            cache: true
                        },
                    }, _options);
                }

                self.vm.ctl = $(this.el);

                $(this.el).select2(_options).on('select2:select', function() {
                    self.vm.value = $(this).val()
                });
            },
            update: function(newValue, oldValue) {
                $(this.el).val(newValue).trigger('change');
            },
            unbind: function() {}
        }
    },
    watch: {
        'value': function(value, oldValue) {
            $(this.ctl).val(value).trigger('change');
        }
    },
    create() {
        $.fn.select2.defaults.set("theme", "bootstrap");
    },
    ready() {
        //            this.control = $(this.$el).find('select');
        //            var _options = _.defaults({}, {
        //                language: 'zh-CN'
        //            });

        //            if (this.url != "") {
        //                _options = _.defaults({
        //                    minimumInputLength: 1,
        //                    ajax: {
        //                        url: this.url,
        //                        dataType: 'json',
        //                        delay: 250,
        //                        data: function (params) {
        //                            return {
        //                                q: params.term, // search term
        //                                page: params.page
        //                            };
        //                        },
        //                        processResults: function (data, page) {
        //                            var result = [];
        //                            if (data && data.data) {
        //                                result = data.data
        //                            }
        //
        //                            return {
        //                                results: result
        //                            };
        //                        },
        //                        cache: true
        //                    },
        //                }, _options);
        //            }

        //            var self = this;
        //            $(this.control).select2(_options).on('select2:select', function () {
        //                self.value = $(this).val()
        //            });
    },

}
</script>
