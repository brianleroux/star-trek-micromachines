// LCARS Interface Enhancements
;(function () {
  'use strict'

  // Subtle scan-line animation on hover for ship cards
  document.querySelectorAll('.lcars-ship-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.style.boxShadow = '0 0 20px rgba(255, 153, 0, 0.15)'
    })
    card.addEventListener('mouseleave', function () {
      card.style.boxShadow = 'none'
    })
  })

  // LCARS "beep" on sidebar clicks (visual flash only, no audio)
  document.querySelectorAll('.lcars-sidebar-block').forEach(function (block) {
    block.addEventListener('click', function () {
      block.style.filter = 'brightness(1.5)'
      setTimeout(function () {
        block.style.filter = ''
      }, 120)
    })
  })

  console.log('🖖 LCARS interface online. Stardate ' + (document.querySelector('.lcars-stardate')?.textContent || 'unknown'))
})()
