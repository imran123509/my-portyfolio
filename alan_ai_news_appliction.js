intent('what can i do here '
      reply('this is a news project'));

//intent('start a command , (p) => {
//       p.play({ command: 'testCommand'});
//})

const API_KEY = 'defd385c6ce44c078cf38616acf96457';
let savedArticles = [];

// news by source 
intent('Give me the news from $(source* (.*))', (p) => {
    let NEWS_APP_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=defd385c6ce44c078cf38616acf96457`;

    if(p.source.value) {
        NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(" ").join('-')}`
    }
    
    api.request(NEWS_APP_URL, (error, response, body) => {
        const {articles} = JSON.parse(body);
        
        if(!articles.length) {
            p.play('sorry please try searching for news from a different source');
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles });
        p.play(`Here are the (latest|recent`) ${p.source.value} news.` );
        
        
        p.play('would you like to read headlines?');
        p.then(confirmation);
        
    });
})

// news by term

intent('Give me the news from $(source* (.*))', (p) => {
    let NEWS_APP_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=defd385c6ce44c078cf38616acf96457`;

    if(p.source.value) {
        NEWS_API_URL = `${NEWS_API_URL}&q=${p.term.value}`
    }
    
    api.request(NEWS_APP_URL, (error, response, body) => {
        const {articles} = JSON.parse(body);
        
        if(!articles.length) {
            p.play('sorry please try searching for news from a different source');
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles });
        p.play(`Here are the (latest|recent`) articles on ${p.term.value}.`);
        
        p.play('would you like to read headlines?');
        p.then(confirmation);
        
        
    });
})

// news by term

const CATEGORIES = {'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'};
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}-${category} ).join('|')}|`;
intent('Give me the news from $(source* (.*))', (p) => {
    let NEWS_APP_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=defd385c6ce44c078cf38616acf96457`;

    if(p.C.value) {
        NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`
    }
    
    api.request(NEWS_APP_URL, (error, response, body) => {
        const {articles} = JSON.parse(body);
        
        if(!articles.length) {
            p.play('sorry please try searching for news from a different source');
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles });
        
         if(p.C.value) {
        NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`
    }else{
        p.play(`Here are the (latest|recent news`);
    }
        p.play('would you like to read headlines?');
        p.then(confirmation);
        
        
    });
});


const confirmation = context(() => {
  intent(`yes`, async (p) => {
      for(let i=0; i<savedArticles.length; i++){
           p.play({ command: 'highlight' , article: savedArticles[i]});
           p.play('$(savedArticles[i].title)');
      }
  )}
  intent(`no`, (p) =>{
        p.play('sounds good to me.')
  })
)}
                             
intent('go back', (p) => {
   p.play('sure, going back');
    p.play({ command: 'newHeadlines', articles: []})
})