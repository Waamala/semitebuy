#!/bin/bash
# Start rails server, run screenshot, kill server.
set -e
cd /home/z/my-project/semitebuyer
export PATH="/home/z/.rbenv/bin:/home/z/.rbenv/shims:$PATH"

# Kill any existing puma
pkill -f "puma" 2>/dev/null || true
sleep 1

# Start server
bin/rails server -p 3001 -b 127.0.0.1 > /tmp/rails.log 2>&1 &
PUMA_PID=$!
echo "puma pid=$PUMA_PID"

# Wait for server
for i in $(seq 1 30); do
  if curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:3001/ 2>/dev/null | grep -q "200"; then
    echo "Server ready after $i seconds"
    break
  fi
  sleep 1
done

# Take screenshots
echo "Taking screenshots..."
node /home/z/my-project/scripts/screenshot.mjs

# Kill puma
kill $PUMA_PID 2>/dev/null || true
echo "Done"
