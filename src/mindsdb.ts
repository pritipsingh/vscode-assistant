import MindsDB from "mindsdb-js-sdk";
export async function getResponse(question: string) {
    try {
        console.log("staringg.....");
        console.log("neww" ,question);
        await MindsDB.connect({
            host: 'https://hackathon.mindsdb.com/',
            user: 'mail2pritipriya@gmail.com',
            password: '@Tara4747'
        });

   const query = `SELECT prompt, completion FROM openai_vscode as m WHERE prompt ="${question}"`;
    const query1 = await MindsDB.SQL.runQuery(query);
    console.log("neww againnn", query1.rows[0].completion);
        return query1.rows[0].completion;

    } catch (error) {
      console.log(error);
      return "Issue Fetching The Response, Please Try Again";
    }
}
