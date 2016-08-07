<style>
@import "../global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css";
</style>
<template>
    <div class="form-group">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div class="input-group date" v-datetime-picker="value" :format="format">
                <input type="text" value="{{value}}" readonly name="{{fieldName}}" class="form-control">
                <span class="input-group-btn">
                    <button class="btn default date-set" type="button">
                        <i class="fa fa-calendar"></i>
                    </button>
                </span>
            </div>
            <span class="help-block">{{tips}}</span>
        </div>
    </div>
</template>
<script>
import '../global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min'
import '../global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN';
import moment from "moment"

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
            default: moment().format("YYYY-MM-DD HH:mm:ss")
        },
        format: {
            type: String,
            default: "YYYY-MM-DD HH:mm:ss"
        }
    },
    directives: {
        'datetimePicker': {
            twoWay: true,
            params: ['format'],
            bind: function() {
                var self = this;
                $(this.el).datetimepicker({
                    // todayHighlight: true,
                    language: 'zh-CN',
                    autoclose: true,
                    format: "yyyy-mm-dd hh:ii:ss",
                    // pickerPosition: "bottom-right",
                    initialDate: new Date()
                }).on('changeDate', function(ev) {
                    if (ev.date) {
                        var TimeZoned = new Date(ev.date.setTime(ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000)));
                        $(self.el).datetimepicker('setDate', TimeZoned);
                        self.set(moment(TimeZoned).format('YYYY-MM-DD HH:mm:ss'))
                    }
                });
            },
            update: function(newValue, oldValue) {

            },
            unbind: function() {

            }
        }
    },
    data() {
        return {}
    },
    ready() {

    },
    components: {}
}
</script>
