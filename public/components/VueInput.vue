<style>
</style>
<template>
    <div class="form-group">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <input v-if="disabled" disabled="disabled" type="{{type}}" name="{{fieldName}}" v-model="value" class="form-control" placeholder="{{placeholder}}" data-rule-url="{{requiredUrl?'true':'false'}}" data-rule-required="{{required?'true':'false'}}">
            <input v-if="!disabled" type="{{type}}" name="{{fieldName}}" v-model="value" class="form-control" placeholder="{{placeholder}}" data-rule-url="{{requiredUrl?'true':'false'}}" data-rule-required="{{required?'true':'false'}}">
            <span class="help-block">{{tips}}</span>
        </div>
    </div>
</template>
<script>
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
            type: Boolean,
            default: false
        },
        requiredUrl: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ""
        },
        value: {
            twoWay: true
        },
        type: {
            type: String,
            default: "text"
        },
        disabled: {
            twoWay: true,
            type: Boolean,
            default: false
        }
    },
}
</script>
