export default function rtfToTransfersArray(str, delimiter='|') {
    const headers = str.slice(0, str.indexOf("--")).replace(/\s/g, '').split(delimiter).slice(3).filter(el => el.trim())
    headers.splice(12,0,'price')
    headers.splice(13,0,'status')
    headers.splice(64,0,'pasgk')
    headers.splice(65,0,'firgk')
    const rows = str.slice(str.indexOf("--") + 1).replace(/-/g, '').replace(/\r/g, '').split('\n').filter(el => el.trim())

    const arr = rows.map(function (row) {
        if (row.length < 20) return null

        const values = row.split(delimiter).slice(3,-1)
        values.splice(12,0,'')
        values.splice(13,0,'')
        values.splice(64,0,'')
        values.splice(65,0,'')
        
        const el = headers.reduce(function (object, header, index) {
            
            if (header === '1v1') header = 'ovo'
            if (header === 'pasgk') { values[index] = values[24] } // копируем пас для вратаря
            if (header === 'firgk') { values[index] = values[26] } // копируем первое касание для вратаря
            if (header === 'price') {
                let cf = 1
                let cf_pos = 1
                let ca = Number(object['ca'])
                let pa = Number(object['pa'])
                let age = Number(object['age'])
                let position = object['position']
                switch (true) {
                    case age < 19: cf = 1.1 
                        break;
                    case age < 21: cf = 1.05
                        break;
                    case age < 23: cf = 1.03
                        break;
                    case age < 28: cf = 1
                        break;
                    case age < 29: cf = 0.95
                        break;
                    case age < 30: cf = 0.85
                        break;
                    case age < 31: cf = 0.8
                        break;
                    case age < 32: cf = 0.75
                        break;
                    case age < 33: cf = 0.65
                        break;
                    case age < 34: cf = 0.6
                        break;
                    case age < 35: cf = 0.5
                        break;
                    default: cf = 0.4
                }
                if (position === 'GK' && age > 29) cf_pos = 1.1
                let price = ((ca+(pa-((pa-ca)*age/16-(pa-ca))))*Math.exp((200-((pa-ca)*age/14-(pa-ca)))/ca*(Math.exp(pa/120))*0.2)*Math.exp((Math.exp((pa-((pa-ca)*age/14-(pa-ca+50)))/200)*Math.exp(ca/200))*1.1)*0.01)/100*cf*cf_pos*0.65
                if (isNaN(price)) price = 0
                values[index] = price.toFixed(2)
            } 
            if (header === 'Nat' && index === 1) header = 'nation'

            header === 'price' ? object[header.toLowerCase()] = values[index] : object[header.toLowerCase()] = values[index].trim()
            return object;
        }, {});
        
        return el
    })
    return arr.filter(el => el)
}
