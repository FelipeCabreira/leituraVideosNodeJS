const leitura = require('fs')
// var properties = require('properties-reader')
// var pro = properties('./20180409/000159.wmv')
const ffmpeg = require('fluent-ffmpeg')
// var cmd = require('node-cmd')
const moment = require('moment')
const path = require('path')
const executable = require('executable')
// var moment = require('moment')
var listDeArquivos = []
var subtraido = []
var propriedadeDuracao = []
var dataHora = []
let stringLimpa = []
// let pastasDias = []
// let pastasDias2 = []
// leitura.readdirSync(__dirname).forEach(function (arquivo) {
//   pastasDias.push(arquivo)
// })
//
// leitura.statSync(__dirname, function (arquivoStat) {
//   console.dir(arquivoStat)
// })

// const dirs = __dirname => leitura.readdirSync(__dirname).filter(f => leitura.statSync(path.join(__dirname, f)).isDirectory())
// console.log(dirs.f)
let pastas = []

leitura.readdirSync(__dirname).filter(function (file) {
  if (leitura.statSync(path.join(__dirname, file)).isDirectory()) {
    if (String(file).match('^[0-9]*$') && String(file).length === 8) {
      pastas.push(file)
    }
  }
})

// var extensaoArquivo = []
// let transformaString = []
for (let j = 0; j < pastas.length; j++) {
  leitura.readdirSync(path.join(__dirname, '/', pastas[j], '/')).forEach(function (arquivo) {
    listDeArquivos.push(arquivo)
  })
  let dir = path.join(__dirname, '/', pastas[j], '/')
  for (let i = 1; i < listDeArquivos.length; i++) {
    let arquivoAtual = listDeArquivos[i]
    let arquivoAnterior = listDeArquivos[i - 1]
    let horaAtual = moment(arquivoAtual.slice(0, -4), 'hhmmss')
    let horaAnterior = moment(arquivoAnterior.slice(0, -4), 'hhmmss')
    // arquivoAtual = moment(pastas, 'YYYYMMDD') + ' ' + arquivoAnterior
    // arquivoAnterior.sort()
    console.log(`pasta: ${pastas[j]}\n`)
    ffmpeg.ffprobe(dir + arquivoAnterior, (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      let horaFinalAnterior = moment(horaAnterior).add(data.format.duration, 'seconds')
      let diferenca = moment.duration(horaAtual - horaFinalAnterior).asSeconds()
      let mensagem = (diferenca >= -3 && diferenca <= 3) ? 'OK' : 'FURADO'
      console.log(` - ${arquivoAnterior}\t${arquivoAtual}\t${data.format.duration}\t${diferenca}\t${mensagem} diretorio: ${dir}`)
    })
  }
  // var promise = new Promise(function (resolve, reject) {
  // // do a thing, possibly async, then…
  //   if (ffmpeg.ffprobe()) {
  //     resolve('Stuff worked!')
  //   } else {
  //     reject(Error('It broke'))
  //   }
  // })

  listDeArquivos.length = 0
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
