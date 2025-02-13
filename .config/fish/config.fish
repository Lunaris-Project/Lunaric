function fish_greeting 
echo "
   ███╗   ██╗██╗██╗  ██╗███████╗██╗   ██╗
   ████╗  ██║██║╚██╗██╔╝██╔════╝██║   ██║
   ██╔██╗ ██║██║ ╚███╔╝ █████╗  ██║   ██║
   ██║╚██╗██║██║ ██╔██╗ ██╔══╝  ╚██╗ ██╔╝
   ██║ ╚████║██║██╔╝ ██╗███████╗ ╚████╔╝
   ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚══════╝  ╚═══╝
    未来を変えるのは、いつだって自分だ。
    "
pokemon-colorscripts -r 1,3,6 --no-title
end
starship init fish | source
fish_add_path ~/.bun/bin
set -x EDITOR /usr/bin/nano
alias ls="ls --color=auto"
alias ll="ls -l"
alias la="ls -a"
alias lh="ls -lh"
alias lha="ls -lha"
alias l="ls"

alias grep="grep --color=auto"
alias fgrep="fgrep --color=auto"
alias egrep="egrep --color=auto"

alias cp="cp -i"
alias mv="mv -i"
