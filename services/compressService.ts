export function compress(uncompressedData: string): string{
    try {
        var dict = {} as any
        var data = (uncompressedData + '').split('')
        var out = []
        var currChar
        var phrase = data[0]
        var code = 256
        for (var i = 1; i < data.length; i++) {
          currChar = data[i]
          if (dict[phrase + currChar] != null) {
            phrase += currChar
          } else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0))
            dict[phrase + currChar] = code
            code++
            phrase = currChar
          }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0))
        for (var j = 0; j < out.length; j++) {
          out[j] = String.fromCharCode(out[j])
        }
        return encodeBase64(out.join(''))
    } catch (e) {
    console.log('Failed to compress string return empty string', e)
    return ''
    }
}

export function decompress(compressedData: any): string{
    try {
        var s = decodeBase64(compressedData)
        var dict = {} as any
        var data = (s + '').split('')
        var currChar = data[0]
        var oldPhrase = currChar
        var out = [currChar]
        var code = 256
        var phrase
        for (var i = 1; i < data.length; i++) {
          var currCode = data[i].charCodeAt(0)
          if (currCode < 256) {
            phrase = data[i]
          } else {
            phrase = dict[currCode] ? dict[currCode] : oldPhrase + currChar
          }
          out.push(phrase)
          currChar = phrase.charAt(0)
          dict[code] = oldPhrase + currChar
          code++
          oldPhrase = phrase
        }
        return out.join('')
    } catch (e) {
    console.log('Failed to decompress string return empty string', e)
    return ''
    }
}

function encodeBase64 (str: string) {
    return window.btoa(unescape(encodeURIComponent(str)))
}

function decodeBase64 (str: string) {
    return decodeURIComponent(escape(window.atob(str)))
}