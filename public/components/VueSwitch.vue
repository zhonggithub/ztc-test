<style>
@import "../../node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css";
</style>
<template>
    <div class="form-group">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <input v-switch type="checkbox" name="{{fieldName}}" v-model="value">
            <span class="help-block">{{tips}}</span>
        </div>
    </div>
</template>
<script>
import "bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min"

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
            twoWay: true
        },
        onText: {
            type: String,
            default: "是"
        },
        offText: {
            type: String,
            default: "否"
        }
    },
    watch: {
        'value': function(val, oldVal) {
            if (this.ctl) {
                $(this.ctl).bootstrapSwitch('state', val);
            }
        }
    },
    directives: {
        'switch': {
            bind: function() {
                var self = this;
                self.vm.ctl = $(this.el);
                $(this.el).bootstrapSwitch({
                    state: self.vm.value,
                    onText: self.vm.onText,
                    offText: self.vm.offText,
                }).on('switchChange.bootstrapSwitch', function(event, data) {
                    var state = $(this).bootstrapSwitch('state');
                    self.vm.value = state;
                })
            },
            update: function(newValue, oldValue) {},
            unbind: function() {}
        }
    },
    data() {
        return {
            ctl: null
        }
    },
    components: {}
}
</script>
