#!/bin/bash
# desktop entry に配置するためのスクリプト

anki_param=$1

function AnkiUpdater {
  sleep 3
  while ! curl -s http://localhost:8765/ >/dev/null; do
    sleep 1
  done
  cd $HOME/work/MarkdoAnki
  $HOME/.asdf/shims/npm run create
}

AnkiUpdater &

exec anki $anki_param
