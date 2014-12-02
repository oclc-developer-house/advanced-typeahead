Issues
======

Issue: Using the VIAF Autosuggest API, we can't get back a decent variety of entity types when we search. Part of the problem, or maybe a symptom of the problem, is that things like titles seem to be tied to personal names. So, the "term" property for one of the items that gets returned may be a title, but the entity (e.g., the one identified by the various IDs in the response) is a person.

Example:

http://viaf.org/viaf/AutoSuggest?query=star%20

Returns:

{  
   "query":"star ",
   "result":[  
      {  
         "term":"Star wars (film). Episode II. Attack of the clones",
         "lc":"nr2002015365",
         "nametype":"personal",
         "dnb":"119187876",
         "selibr":"280988",
         "bnf":"11913565",
         "jpg":"500278908",
         "bne":"xx985182",
         "nkc":"jn20001227115",
         "ptbnp":"33259",
         "nla":"000040396233",
         "viafid":"16738168"
      },
      {  
         "term":"Star Numan, Cornelis, 1807-1857",
         "lc":"no2010198922",
         "nametype":"personal",
         "dnb":"100535240",
         "viafid":"61898490"
      },
      {  
         "term":"Star Trek, the motion picture (film)",
         "lc":"n85344558",
         "nametype":"personal",
         "dnb":"119268647",
         "bnf":"12443420",
         "bne":"xx1068112",
         "nkc":"pna2009495475",
         "ptbnp":"1463599",
         "nla":"000035813633",
         "viafid":"115354709"
      },
      {  
         "term":"Star Black",
         "lc":"n81025260",
         "nametype":"personal",
         "dnb":"113786395",
         "bnf":"12536295",
         "bne":"xx1088397",
         "egaxa":"vtls001355558",
         "nkc":"xx0143049",
         "ptbnp":"1465831",
         "nla":"000036266605",
         "viafid":"44410479"
      },
      {  
         "term":"\u0098A \u009cstar is born (film)",
         "lc":"n50018724",
         "nametype":"personal",
         "dnb":"121082806",
         "bnf":"12437089",
         "bne":"xx1078287",
         "nkc":"ola2002159043",
         "nla":"000035032530",
         "viafid":"76409534"
      },
      {  
         "term":"Star Sisters",
         "lc":"no98021702",
         "nametype":"corporate",
         "dnb":"320061442",
         "bnf":"13906710",
         "viafid":"150243718"
      },
      {  
         "term":"Star Black",
         "lc":"n79086303",
         "nametype":"personal",
         "dnb":"109942892",
         "bnf":"11892176",
         "bne":"xx1150286",
         "nla":"000035019069",
         "viafid":"66463900"
      },
      {  
         "term":"Star records",
         "nametype":"corporate",
         "bnf":"13954942",
         "viafid":"152639146"
      },
      {  
         "term":"Star Busmann, C.W. , 1877-1966",
         "lc":"no93013072",
         "nametype":"personal",
         "nkc":"kv2011633683",
         "viafid":"212513628"
      },
      {  
         "term":"Star wars (film). Episode V. :The: Empire strikes back",
         "lc":"no98067276",
         "nametype":"personal",
         "dnb":"121335283",
         "dnb":"187608873",
         "bnf":"12616128",
         "bne":"xx1298555",
         "nkc":"jcu2010584306",
         "nla":"000035823564",
         "viafid":"59204776"
      }
   ]
}

For the first result, you'd expect to get some sort of entity representing the film, but if you follow the VIAF identifier,

http://viaf.org/viaf/16738168/

the entity returned is the person George Lucas.

Several of the results in the above example are obviously titles but have a nameType of "personal."