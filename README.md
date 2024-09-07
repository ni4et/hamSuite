Unable to find a Linux ham radio logging that met my desires after losing both my windows laptops to a ransom ware attack I launched an overly ambitious project to develop my own. I was using HamRadioDeluxe.  I doubt if I can ever finish it but I'm having fun with it anyway. Experienced JS progrmmers will cringe at my code, after all its 40+ years ago I started with C/C++, old habits die hard.
Goals for the project:
  Run on Win, Mac, and Unix-ish platform that will support Node.js. The database needn't be on the same server.
  Base it on a no-sql database (ReThink db): The schema will be ADIF key words.
  Run the entire user interface out of a web browser.
  Serve everthing locally, ie: bootstrap, jQuery or socketio-client, so that the application is usable without a network connnection to the internet.  This is to support Field Day, POTA, or other field activities.

  
  Archetecture: node.js, express, ejs page rendering, Socket.IO.   No complicated UI frameworks.
  Support contests, rag chewing, DX, wsjtx.
  Bonus points, run multiple contest stations out of the same node server and database.
  All log inports, exports, and integration with LOTW and qrz are on web pages and work across the home or contest LAN.
  Integrate with radio via hamlib.
  Itegrate as mush public software as possible to meet goals.

  I have about 15% of it done but it is moving faster as I gain comfort with full stack Javascript.
  
  Its here so that I can move the code to other machines.  My development laptop is windows but the station computer is a seprate Linux laptop at my station.
  NI4ET is my callsign on Ham Radio.  I can be contacted via arrl.net.
  
