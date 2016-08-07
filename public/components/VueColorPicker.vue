<style>
@import "../global/plugins/bootstrap-colorpicker/css/colorpicker.css";
</style>
<template>
    <div class="form-group">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div v-color-picker="value" class="input-group input-medium color components_colorpicker">
                <input type="text" class="form-control" v-model="value" readonly name="{{fieldName}}" data-rule-required="{{required}}">
                <span class="input-group-btn">
                    <button class="btn default" type="button">
                        <i v-bind:style="{'background-color': value}"></i>&nbsp;
                    </button>
                </span>
            </div>
            <span class="help-block">{{tips}}</span>
        </div>
    </div>
</template>
<script>
import "../global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker"

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
        value: {
            type: String,
            twoWay: true,
            default: "#ffffff",
        },
        format: {
            type: String,
            default: "hex"
        },
    },
    directives: {
        'colorPicker': {
            twoWay: true,
            bind: function() {
                var self = this;
                $(this.el).colorpicker({
                    format: self.vm.format,
                    color: '#ffffff'
                });

                $(this.el).on('changeColor', function(ev) {
                    var rgb = ev.color.toRGB();
                    var val;
                    if (self.vm.format == 'hex') {
                        self.set(ev.color.toHex())
                    } else if (self.vm.format == 'rgba') {
                        val = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
                        self.set(val)
                    } else if (self.vm.format == 'rgb') {
                        val = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
                        self.set(val);
                    }
                });
            },
            update: function(newValue, oldValue) {},
            unbind: function() {}
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
