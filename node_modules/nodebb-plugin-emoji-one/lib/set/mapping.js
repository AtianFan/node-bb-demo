"use strict";

/*
 * Basic mapping ported from
 * https://github.com/Ranks/emojione/blob/9a0d5241a00a10f4458bda168bd0c6f654df19c6/lib/js/emojione.js#L18-L145
 * Changes are stated within appropriate lines
 */

module.exports = {
  separationLeading: {
    joy: /:'-?\)/,
    grinning: /(?::-?|=)[\)\]]/, // added :-] used grinning in favor of smile
    sweat_smile: /'(?::-?|=)\)/,
    smile: /&gt;(?:[;:]-?|=)\)/, // added >;-) used smile in favor of laughing
    wink: /(?:[;\*]-?|;\^)[\)\]]/, // added *-] *] and ;^]
    sweat: /'(?::-?|=)\(/,
    kissing_heart: /(?::[\^-]?|=)\*/,
    disappointed: /(?:=|:-?|&gt;:)[\[\(]/, // added =[ and >:(
    angry: /&gt;:-?\(/,
    cry: /(?:;|:')-?\(/,
    persevere: /&gt;\.&lt;/,
    fearful: /D:/,
    dizzy_face: /[#%X]-?\)/,
    ok_woman: /\*\\[0O]\/\*|\\[0O]\//,
    innocent: /[O0](?:;[\^-]|:-?|=)\)/, // added O;^)
    sunglasses: /[B8]-?\)/,
    expressionless: /-_{1,3}-/,
    confused: /(?:(?:&gt;)?:|=)[\\\/]|:-[\/\.]/,
    stuck_out_tongue: /d:/,
    no_mouth: /(?::-?|=)#/,
    question: /\?\?\?/, // added
    exclamation: /!!!/ // added
  },
  separationWrapped: {
    heart: /&lt;3/,
    broken_heart: /&lt;[\/\\\|!]3/, // added <\3 <|3 <!3
    smiley: /(?::-?|=)D/,
    sweat_smile: /'(?::-?|=)D/,
    laughing: /x[-=]?d/i, // added
    wink: /;D/,
    stuck_out_tongue_winking_eye: /(?:x-|&gt;:)p/i, // added x-P X-p and >:p
    angry: /:@/,
    flushed: /[:=]$/,
    innocent: /[O0]:-?3/,
    sunglasses: /[B8]-D/,
    confused: /[:=]L/,
    confounded: /[:=]s/i, // added
    stuck_out_tongue: /:-?[bPpÞþ]|=[pP]/,
    hushed: /:&gt;o/i, // added
    open_mouth: /:-?[oO]|&gt;:[oO]|O_o|o_O/, // removed O_O added o_O and O_o
    eyes: /O_O|o_o/, // added
    no_mouth: /(?::-?|=)x/i,
    zzz: /zzz/i // added
  }
};
