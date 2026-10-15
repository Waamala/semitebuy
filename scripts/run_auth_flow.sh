#!/bin/bash
# Start server, auto-confirm test user, run auth flow screenshots
set -e
cd /home/z/my-project/semitebuyer
export PATH="/home/z/.rbenv/bin:/home/z/.rbenv/shims:$PATH"

pkill -f "puma" 2>/dev/null || true
sleep 1

bin/rails server -p 3001 -b 127.0.0.1 > /tmp/rails.log 2>&1 &
PUMA_PID=$!
echo "puma pid=$PUMA_PID"

for i in $(seq 1 30); do
  if curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:3001/ 2>/dev/null | grep -q "200"; then
    echo "Server ready after $i seconds"
    break
  fi
  sleep 1
done

# Run auth flow screenshots
node /home/z/my-project/scripts/auth_flow.mjs

# Auto-confirm the test user (since we don't have email sending)
echo "Auto-confirming test user..."
bin/rails runner "u = User.find_by(email: 'ivan.test@example.com'); u.update(confirmed_at: Time.current); puts 'confirmed: ' + u.email" 2>&1 | tail -3

# Continue flow — try login again now that user is confirmed
node /home/z/my-project/scripts/login_flow.mjs

kill $PUMA_PID 2>/dev/null || true
echo "Done"
