import Vue from 'vue'
import { ValidationObserver, ValidationProvider, extend, configure } from "vee-validate";
import {
    required,
    alpha,
    alpha_num,
    integer,
    numeric,
    is_not,
    excluded
} from "vee-validate/dist/rules.umd.js";

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

configure({
    classes: {
        valid: 'is-valid',
        invalid: 'is-invalid',
    }
})

extend("required", {
    ...required,
    message: "This field is required"
});

extend("alpha", {
    ...alpha,
    message: "This field must only contain alphabetic characters"
});

extend("alpha_num", { ...alpha_num });
extend("integer", { ...integer });
extend("numeric", { ...numeric });
extend("is_not", { ...is_not });

extend("excluded", { ...excluded, message: "{_field_} value is already use." });

extend("decimal", {
    validate: (value, { decimals = '*', separator = '.' } = {}) => {
        if (value === null || value === undefined || value === '') {
            return {
                valid: false
            };
        }
        if (Number(decimals) === 0) {
            return {
                valid: /^-?\d*$/.test(value),
            };
        }
        const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
        const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`);

        return {
            valid: regex.test(value),
        };
    },
    message: 'This {_field_} field must be integer/decimal value.'
})
