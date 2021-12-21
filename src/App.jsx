import React, { useState } from "react";
import { Octokit } from "@octokit/core";

const octokit = new Octokit()

const App = ()=>{
  
  let [body, setBody] = useState({})

  const calc = async(e) =>{
    e.preventDefault()
    const username = e.target.username.value
    const data = await octokit.request(`GET /users/${username}`)
    .then(data => formatData(data))
    .catch(err => console.log(err));

    const repoData = await octokit.request(`GET /users/${username}/repos`)
    .then(repos => repos.data.filter(repo =>repo.fork))
    .then(data => data.map(repo => repo.name));

    data["Repo"] = repoData;

    setBody(data)
  }

  const formatData = (data) =>{
    console.log("entered")
    return {"Username": data.data.login,
            "Email": data.data.email,
            "Bio": data.data.bio,
            "Created at": data.data.created_at,
            "Updated at": data.data.updated_at,
            "Number of repos": data.data.public_repos,
            "Number of followers": data.data.followers
        };
}

  return (<>
    <form onSubmit={calc}>
      <label htmlFor="username">username</label>
      <input type="text" name="username"></input>
      <button type="submit">Search</button>
    </form>
    <div>
        <h3>Name : {body["Username"]}</h3>
        <h3>Email : {body["Email"]}</h3>
        <h3>Bio : {body["Bio"]}</h3>
        <h3>Number of repos: {[body["Number of repos"]]} </h3>
        <h3>Number of followers: {body["Number of followers"]} </h3>
        <h3>Forked repos:</h3>
        {body["Repo"]? <ul>
          {body["Repo"].map(repo=> <li>{repo}</li>)}
        </ul> : null}
    </div>
  </>)
}

export default App