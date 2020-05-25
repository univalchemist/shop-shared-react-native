# Server for simulating server requests
# Note that Android will need to reach localhost via the special IP 10.0.2.2
# To run:
# bundle install
# ruby server.rb
require 'sinatra'

disable :logging
use Rack::Logger

before do
  content_type 'application/json'
  if request.request_method != 'GET'
    body = request.body.read
    begin
      @data = JSON.parse(body)
      puts @data
    rescue
      puts body
    end
  end
end

post '/auth/api/v1/oauth/token' do
  File.read('./responses/oauth_token.json')
end

get '/member/api/v1/clients/*/users/*/profile' do
  File.read('./responses/member_profile.json')
end

get '/benefit/api/v1/clients/*/users/*/Benefits' do
  File.read('./responses/member_benefits.json')
end

get '/wallet/api/v1/clients/*/users/*/wallet/externalwallet' do
  File.read('./responses/external_wallet.json')
end

get '/wellness/api/v1/clients/*/users/*/healthresponses' do
  File.read('./responses/healthresponses.json')
end

get '/wellness/api/v1/clients/*/users/*/healthresults' do
  File.read('./responses/healthresults.json')
end

get '/wellness/api/v1/clients/*/users/*/healthscore' do
  File.read('./responses/healthscore.json')
end

get '/wellness/api/v1/clients/*/users/*/healthscorehistory' do
  File.read('./responses/healthscorehistory.json')
end

get '/wellness/api/v1/clients/*/users/*/faceaging/results' do
  halt 204
end

get '/wellness/api/v1/clients/*/users/*/lifestyletips' do
  File.read('./responses/lifestyle_tips.json')
end

get '/wellness/api/v1/clients/*/users/*/lifestyleresults' do
  File.read('./responses/lifestyle_results.json')
end

get '/api/3/claim/items' do
  File.read('./responses/claim_items.json')
end

get '/api/3/claim/fields' do
  claim_item_id = params['claimItemId']
  if !claim_item_id
    halt 400, { messageKey: 'claimItemId required'}.to_json
  end
  File.read("./responses/claim_fields_#{claim_item_id}.json")
end

post '/api/3/claim/submit' do
  sleep 1.5
  if @data['claimantName'] == 'Dependant|27'
    halt 400, { messageKey: '#DIGITAL_SIZE#' }.to_json
  elsif
    @data['claimantName'] == 'Dependant|28'
    halt 400, { messageKey: 'Does not exist' }.to_json
  else
    File.read('./responses/claim_submit.json')
  end
end

post '/api/3/digitalcontent/upload/Claim/Receipt' do
  data = JSON.parse File.read('./responses/digitalcontent_upload_claim_receipt.json')
  data['pkDigitalContent'] = Time.now.to_i
  data.to_json
end

get '/content/api/v1/clients/*/documents' do
  File.read('./responses/documents.json')
end

get '/api/3/benefit/plans' do
  File.read('./responses/benefit_plans.json')
end

get '/api/3/claim/list/pending' do
  sleep 3
  benefitPeriod = params['benefitPeriod']
  if !benefitPeriod
    halt 400, { messageKey: 'benefitPeriod required'}.to_json
  end
  File.read("./responses/claim_pending_history_#{benefitPeriod}.json")
end

get '/api/3/claim/list' do
  sleep 3
  benefitPeriod = params['benefitPeriod']
  if !benefitPeriod
    halt 400, { messageKey: 'benefitPeriod required'}.to_json
  end
  File.read("./responses/claim_history_#{benefitPeriod}.json")
end
