const leitura = require('fs')
// var properties = require('properties-reader')
// var pro = properties('./20180409/000159.wmv')
const ffmpeg = require('fluent-ffmpeg')
// var cmd = require('node-cmd')
const moment = require('moment')
const path = require('path')
// var moment = require('moment')
var listDeArquivos = []
// var subtraido = []
// var propriedadeDuracao = []
// var dataHora = []
// let stringLimpa = []
// let pastasDias = []
// let pastasDias2 = []
// leitura.readdirSync(__dirname).forEach(function (arquivo) {
//   pastasDias.push(arquivo)
// })
//
// leitura.statSync(__dirname, function (arquivoStat) {
//   console.dir(arquivoStat)
// })

const parametros = process.argv.slice(2)
const dataAtual = parametros[0]
const caminhoDiretorio = parametros[1]

// let caminho = __dirname

// function getDirectories (caminho) {
//   return leitura.readdirSync(caminho).filter(function (file) {
//     return leitura.statSync(caminho + '/' + file).isDirectory()
//   })
// }
// console.log(caminho)

process.argv.forEach(function (caminhoDiretorio, dataAtual) {
  console.log(dataAtual + ': ' + caminhoDiretorio)
})

leitura.readdirSync(path.join(__dirname, '/20180409')).forEach(function (arquivo) {
  listDeArquivos.push(arquivo)
})
// var extensaoArquivo = []
// let transformaString = []

let dir = path.join(__dirname, '/20180409/')
for (let i = 1; i < listDeArquivos.length; i++) {
  let arquivoAtual = listDeArquivos[i]
  let arquivoAnterior = listDeArquivos[i - 1]
  let horaAtual = moment(arquivoAtual.slice(0, -4), 'hhmmss')
  let horaAnterior = moment(arquivoAnterior.slice(0, -4), 'hhmmss')
  ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg-20180418-223f3df-win64-static/ffmpeg-20180418-223f3df-win64-static/bin/ffmpeg.exe'))
  ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg-20180418-223f3df-win64-static/ffmpeg-20180418-223f3df-win64-static/bin/ffprobe.exe'))
  ffmpeg.ffprobe(dir + arquivoAnterior, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    let horaFinalAnterior = moment(horaAnterior).add(data.format.duration, 'seconds')
    let diferenca = moment.duration(horaAtual - horaFinalAnterior).asSeconds()
    let mensagem = (diferenca >= -3 && diferenca <= 3) ? 'OK' : 'FURADO'
    console.log(` - ${arquivoAnterior}\t${arquivoAtual}\t${data.format.duration}\t${diferenca}\t${mensagem}`)
  })
}

/*

for (let i = 0; i < listDeArquivos.length; i++) {
  stringLimpa[i] = listDeArquivos[i].slice(0, -4) // retira a extensao do arquivo
  dataHora[i] = moment(stringLimpa[i], 'hhmmss') // transforma o nome dos arquivos em hora:minuto:segundo
  // console.log(dataHora[i])
  // console.log(stringLimpa[i])
  if (i > 0) {
    subtraido[i] = Math.abs(dataHora[i] - dataHora[i - 1]) // subtrai o nome de um arquivo(tempo) pelo anterior, para pegar a diferenca de tempo determinada
    // console.log('subtraido: ' + moment.duration(subtraido[i]).asSeconds())
  }
  let command = ffmpeg(path.join(__dirname, '/20180409/') + listDeArquivos[i])
  command.ffprobe((err, data) => {
    // ffmpeg.ffprobe(path.join(__dirname, '/20180409/') + listDeArquivos[i], (err, data) => {
    if (!err) {
      propriedadeDuracao[i] = data.format.duration // pega a duracao do video nas propriedades (details) do arquivo
      // console.log('duracao do arquivo:' + propriedadeDuracao[i])
    } else {
      console.log('erro', err)
    }
    if (i < (propriedadeDuracao.length - 1)) {
      console.log('subtract ' + listDeArquivos[i] + ': ' + (moment.duration(subtraido[i + 1]).asSeconds() - propriedadeDuracao[i].toFixed(0))) // subtrai
      if ((moment.duration(subtraido[i + 1]).asSeconds() - propriedadeDuracao[i]) > 3 || (moment.duration(subtraido[i + 1]).asSeconds() - propriedadeDuracao[i]) < -3) {
        console.log('Arquivo furado: ' + stringLimpa[i])
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
*/
