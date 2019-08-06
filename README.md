
Requires:
  MacOSX
  Homebrew

Setup:
  Info: @ https://getgrav.org/blog/macos-mojave-apache-multiple-php-versions

  Run: brew tap exolnet/homebrew-deprecated
  Run: brew install php@5.6
  Run: brew install php@7.0
  Run: brew install php@7.1
  Run: brew install php@7.2
  Run: brew install php@7.3

  Run: curl -L https://gist.githubusercontent.com/rhukster/f4c04f1bf59e0b74e335ee5d186a98e2/raw > /usr/local/bin/sphp
  Run: chmod +x /usr/local/bin/sphp

