#!/usr/bin/env node
import { join } from "path";
import starter from "../lib/starter.js";
const destination = getDest(process.argv[2]);

function getDest(destFolder = null) {
  if (destFolder) return join(process.cwd(), destFolder);
  else return destFolder;
}

starter(destination);
