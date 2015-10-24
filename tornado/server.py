import tornado.ioloop, tornado.web, tornado.websocket, tornado.template
import settings
import json, urllib, httplib2

clients = []
rooms = []

class Player:
  def __init__(self, name, client):
    self.name = name
    self.score = 0
    self.client = client

class Room:
  def __init__(self, name, categories):
    self.name = name
    self.categories = categories
    self.players = []

  def join(self, client, playerName):
    player = Player(playerName, client)
    self.players.append(player)



class WebSocketChatHandler(tornado.websocket.WebSocketHandler):
  def check_origin(self, origin):
    return True

  def open(self, *args):
    print("open", "WebSocketChatHandler")
    clients.append(self)

  def on_message(self, request):

    data = json.loads(request) 
    
    if 'type' in data:
      if data['type'] == 'create':

        h = httplib2.Http()
        resp, body = h.request("http://localhost:8000/api/game", "GET")
        api_data = json.loads(body)
        categories = api_data['objects']

        room = Room(data['roomName'], categories)
        room.join(self, data['playerName'])
        rooms.append(room)

        for player in room.players: 
          player.client.write_message(data)

      elif data['type'] == 'join':

        room = None
        for r in rooms:
          if r.name == data['roomName']:
            room = r
            break

        if not room:
          print "ERROR ROOM NOT FOUND"
          return
          # TODO: create new room?

        room.join(self, data['playerName'])
        for player in room.players: 
          player.client.write_message(data)

      elif data['type'] == 'message':
        for client in clients:
          client.write_message(data)

      elif data['type'] == 'start':
        room = None
        for r in rooms:
          if r.name == data['roomName']:
            room = r
            break

        if room:
          players = []
          for player in room.players:
            players.append({"name": player.name})
          for player in room.players:
            player.client.write_message({"type": "start", "categories": room.categories, "players": players})

      elif data['type'] == 'question':
        room = None
        for r in rooms:
          if r.name == data['roomName']:
            room = r
            break

        if room:
          for player in room.players:
            player.client.write_message(data)

      elif data['type'] == 'buzz':
        room = None
        for r in rooms:
          if r.name == data['roomName']:
            room = r
            break

        if room:
          for player in room.players:
            player.client.write_message(data)
      else:
        pass

  def on_close(self):
    clients.remove(self)

app = tornado.web.Application([
    (r'/chat', WebSocketChatHandler), 
], autoreload=True)

app.listen(settings.PORT_NUMBER)
print "Server listing on http://localhost:%s" % settings.PORT_NUMBER
tornado.ioloop.IOLoop.instance().start()