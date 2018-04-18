const leitura = require('fs')
// var properties = require('properties-reader')
// var pro = properties('./20180409/000159.wmv')
const ffmpeg = require('fluent-ffmpeg')
// var cmd = require('node-cmd')
const moment = require('moment')
const path = require('path')

// var moment = require('moment')
var listDeArquivos = []
let subtraido = []
let propriedadeDuracao = []
let pastasDias = []
// let pastasDias2 = []
leitura.readdirSync(__dirname).forEach(function (arquivo) {
  pastasDias.push(arquivo)
})

leitura.statSync(__dirname, function (arquivoStat) {
  console.dir(arquivoStat)
})

leitura.readdirSync(path.join(__dirname, '/20180409')).forEach(function (arquivo) {
  listDeArquivos.push(arquivo)
})

let dataHora = []
// var extensaoArquivo = []
// let transformaString = []
let stringLimpa = []
for (let i = 0; i < listDeArquivos.length; i++) {
  // stringLimpa[i] = lista[i].replace('.wmv', '') // retira extensao
  stringLimpa[i] = listDeArquivos[i].slice(0, -4)
  // transformaString[i] = '' + stringLimpa[i] // transforma em string
  // stringLimpa[i] = transformaString[i].substr(0, transformaString[i].lastIndexOf('.'))
  dataHora[i] = moment(stringLimpa[i], 'hhmmss')
  // console.log(dataHora[i])
  // console.log(stringLimpa[i])
  if (i > 0) {
    // subtraido[i] = moment().subtract(arrayComMoment[i - 1]).format(arrayComMoment[i])
    subtraido[i] = Math.abs(dataHora[i] - dataHora[i - 1])
    // console.log('subtraido: ' + moment.duration(subtraido[i]).asSeconds())
  }
  ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg-20180418-223f3df-win64-static/ffmpeg-20180418-223f3df-win64-static/bin/ffmpeg.exe'))
  ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg-20180418-223f3df-win64-static/ffmpeg-20180418-223f3df-win64-static/bin/ffprobe.exe'))
  ffmpeg.ffprobe(path.join(__dirname, '/20180409/') + listDeArquivos[i], function (err, data) {
    if (!err) {
      propriedadeDuracao[i] = data.format.duration
      // console.log('duracao do arquivo:' + propriedadeDuracao[i])
    } else {
      console.log('erro', err)
    }

    if (i < (propriedadeDuracao.length - 1)) {
      console.log('subtract ' + listDeArquivos[i] + ': ' + (moment.duration(subtraido[i + 1]).asSeconds() - propriedadeDuracao[i].toFixed(0)))
      if ((moment.duration(subtraido[i + 1]).asSeconds() - propriedadeDuracao[i]) > 3 || (moment.duration(subtraido[i + 1]).asSeconds() - propriedadeDuracao[i]) < -3) {
        console.log('Arquivo furado: ' + listDeArquivos[i])
      }
    }
  })
}

// para executar comandos do cmd direto a partir do nodejs:
// cmd.get('ffprobe -of json -show_format /mnt/c/Users/Desenv-04/Documents/20180409/000159.wmv', function (err, data, stderr) {
//   if (!err) {
//     console.log('the node-cmd cloned dir contains these files :\n\n', data)
//   } else {
//     console.log('error', err)
//   }
// })
