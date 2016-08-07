<style>
@import "../../node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css";
</style>
<template>
    <div class="form-group">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div class="input-inline input-medium components_spinner">
                <input v-spinner="value" type="text" v-model="value" name="{{fieldName}}" class="form-control" required>
            </div>
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
        min: {
            type: Number,
            default: 1
        },
        step: {
            type: Number,
            default: 1
        },
        max: {
            type: Number,
            default: 99999999
        },
        decimals: {
            type: Number,
            default: 0
        },
        postfix: {
            type: String,
            default: ""
        },
    },
    watch: {
        value: function(val, oldVal) {
            if (typeof(val) == 'undefined') {
                val = 1;
            }
            return val.toString()
        }
    },
    directives: {
        'spinner': {
            twoWay: true,
            bind: function() {
                var self = this;

                $(this.el).TouchSpin({
                    min: this.vm.min,
                    max: this.vm.max,
                    step: this.vm.step,
                    decimals: this.vm.decimals,
                    postfix: this.vm.postfix,
                    mousewheel: false,
                    buttondown_class: 'btn default',
                    buttonup_class: 'btn default',
                });
            },
            update: function(newValue, oldValue) {},
            unbind: function() {}
        }
    },
    data() {
        return {}
    },
    components: {}
}
</script>
