using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ABCUniverse.Portable.Trees.Analysis
{
    /// <summary>
    /// TreeCodeEmitter muss noch fertig gestellt werden (es gibt einige wenige Stellen aus dem ursprünglichen Code,
    /// die noch nicht funktionieren können, weil Klassen und/oder Methoden falsch sind/nicht existieren oder aber 
    /// auf Variablen zugegriffen werden soll, die noch nicht deklariert wurden
    /// </summary>
    public class TreeCodeEmitter
    {
        public static string GetTreeCode(string language)
        {
            string emittedCode = "";
            switch (language)
            {
                case "R":
                    emittedCode = String.Format("# R sample code{0}{1}", Environment.NewLine, EmitRCode());
                    break;
                case "MATLAB":
                    emittedCode = String.Format("% Matlab sample code{0}{1}", Environment.NewLine, EmitMatlabCode());
                    break;
                default:
                    emittedCode = "Error: No output language selected";
                    break;
            }
            return emittedCode;
        }

        static string EmitMatlabCode()
        {
            StringBuilder sb = new StringBuilder();
            #region Matlab sample

            sb.AppendLine("% if you use the clipboard, paste this code to a script and save it in the workspace");
            //sb.AppendLine(String.Format("% you can call it then from the console using '{0}()'", _currentTreeName));
            sb.AppendLine("% the main function: ");
            //sb.AppendLine(String.Format("function mat = {0}()", _currentTreeName));
            sb.AppendLine("% variables for lastCue, cues, and classifier (criteria):");
            sb.AppendLine("% ffTree has four rows (with one column for each cue");
            sb.AppendLine("% (1) Cue split values");
            sb.AppendLine("% (2) Orientation (1 = low cue → low criterion, 0 = low cue → high criterion");
            sb.AppendLine("% (3) Exit on low cue value (below split)?");
            sb.AppendLine("% (4) Exit on high cue value (above split)");
            //List<string> list = CurrentDecisionTree.GetMatlabModel(_embeddedData);
            //sb.AppendLine(list[0]);
            //sb.AppendLine(list[1]);
            //sb.AppendLine(list[2]);
            sb.AppendLine("% here comes the computation stuff:");
            sb.AppendLine("  tp = 0;");
            sb.AppendLine("  fa = 0;");
            sb.AppendLine("  tn = 0;");
            sb.AppendLine("  miss = 0;");
            sb.AppendLine("  nrow = size(data,1);");
            sb.AppendLine("  for i = 1:nrow");
            sb.AppendLine("     y = classify(data(i,:),ffTree);");
            sb.AppendLine("     % low cue → low criterion // high cue → high criterion");
            sb.AppendLine("     if(y == 1) % low cue");
            //sb.AppendLine(String.Format("       if (classifier(i) > {0})", _criterionSplit.ToString("F2", CultureInfo.InvariantCulture)));
            sb.AppendLine("          miss = miss + 1;");
            sb.AppendLine("       else");
            sb.AppendLine("          tn = tn + 1;");
            sb.AppendLine("       end");
            sb.AppendLine("     end");
            sb.AppendLine(" ");
            sb.AppendLine("     if(y == 2) % high cue");
            //sb.AppendLine(String.Format("       if (classifier(i) > {0})", _criterionSplit.ToString("F2", CultureInfo.InvariantCulture)));
            sb.AppendLine("         tp = tp + 1;");
            sb.AppendLine("       else");
            sb.AppendLine("         fa = fa + 1;");
            sb.AppendLine("       end");
            sb.AppendLine("     end");
            sb.AppendLine("   ");
            sb.AppendLine("     % low cue → high criterion // high cue → low criterion");
            sb.AppendLine("     if (y==3)  % low cue");
            //sb.AppendLine(String.Format("       if (classifier(i) > {0})", _criterionSplit.ToString("F2", CultureInfo.InvariantCulture)));
            sb.AppendLine("         tp = tp+1;  ");
            sb.AppendLine("       else");
            sb.AppendLine("         fa = fa + 1;");
            sb.AppendLine("       end");
            sb.AppendLine("     end;");
            sb.AppendLine("      ");
            sb.AppendLine("     if(y == 4) % high cue");
            ////sb.AppendLine(String.Format("       if (classifier(i) > {0})", _criterionSplit.ToString("F2", CultureInfo.InvariantCulture)));
            sb.AppendLine("         miss = miss + 1;");
            sb.AppendLine("       else");
            sb.AppendLine("         tn = tn + 1;");
            sb.AppendLine("       end");
            sb.AppendLine("     end ");
            sb.AppendLine("  end");
            sb.AppendLine("  mat = [tp fa;miss tn];");
            sb.AppendLine("  end");
            sb.AppendLine("  ");
            sb.AppendLine("  % classification function (used in main function)");
            sb.AppendLine("  function y = classify(cueValues,ffTree)");
            sb.AppendLine("    n = size(ffTree,2);");
            sb.AppendLine("    y = 0;");
            sb.AppendLine("    step = 0;");
            sb.AppendLine("    ");
            sb.AppendLine("    % step through each cue");
            sb.AppendLine("    for i=1:n;");
            sb.AppendLine("      step=step+1;  ");
            sb.AppendLine("      % low cue → low criterion");
            sb.AppendLine("      if (ffTree(2,i) == 1)");
            sb.AppendLine("          % low cue exit?");
            sb.AppendLine("          if (ffTree(3,i) == 1)");
            sb.AppendLine("              if (cueValues(i) < ffTree(1,i))");
            sb.AppendLine("                  y=1;");
            sb.AppendLine("                  break;");
            sb.AppendLine("              end");
            sb.AppendLine("          end;");
            sb.AppendLine("          % high cue exit?");
            sb.AppendLine("          if (ffTree(4,i) == 1)");
            sb.AppendLine("              if (cueValues(i) >= ffTree(1,i))   ");
            sb.AppendLine("                  y=2;");
            sb.AppendLine("                  break;");
            sb.AppendLine("              end;");
            sb.AppendLine("          end;");
            sb.AppendLine("      end;");
            sb.AppendLine("      ");
            sb.AppendLine("      % low cue → high criterion");
            sb.AppendLine("      if (ffTree(2,i) == 0)");
            sb.AppendLine("          % low cue exit?");
            sb.AppendLine("          if (ffTree(3,i) == 1)");
            sb.AppendLine("              if (cueValues(i) < ffTree(1,i))");
            sb.AppendLine("                  y=3;");
            sb.AppendLine("                  break;");
            sb.AppendLine("              end;");
            sb.AppendLine("          end;");
            sb.AppendLine("          % high cue exit?");
            sb.AppendLine("          if (ffTree(4,i) == 1)");
            sb.AppendLine("              if (cueValues(i) >= ffTree(1,i))");
            sb.AppendLine("                  y=4;");
            sb.AppendLine("                  break;");
            sb.AppendLine("              end;");
            sb.AppendLine("          end;");
            sb.AppendLine("      end;");
            sb.AppendLine("    end;");
            sb.AppendLine("  end");
            #endregion
            return sb.ToString();
        }

        static string EmitRCode()
        {
            StringBuilder sb = new StringBuilder();
            #region R sample
            sb.AppendLine("# global variables for cues, classifier (criteria) and lastCue");
            sb.AppendLine("data = matrix(c(11,9,0,8,1,1,0,0,0), nrow=3, byrow=TRUE);");
            sb.AppendLine("classifier = matrix(c(1,1,0), nrow=1, byrow=TRUE);");
            sb.AppendLine("fftree = matrix(c(7,9,1,1,1,0), nrow=2, byrow=TRUE);");
            sb.AppendLine("# now the main function");
            //sb.AppendLine(String.Format("# call it on the console using '{0}()'", _currentTreeName));
            //sb.AppendLine(String.Format("{0} <- function()", _currentTreeName));
            sb.AppendLine("{");
            sb.AppendLine("	tp=0;");
            sb.AppendLine("	fa=0;");
            sb.AppendLine("	tn=0;");
            sb.AppendLine("	miss=0;");
            sb.AppendLine(" n=length(fftree[1,])");
            sb.AppendLine("");
            sb.AppendLine("	for (i in 1:n)");
            sb.AppendLine("	{");
            sb.AppendLine("		y = classify(data[i,], fftree, i);");
            sb.AppendLine("		if (y==1 && classifier[i]==1)");
            sb.AppendLine("			tp=tp+1;");
            sb.AppendLine("		if (y==1 && classifier[i]==0)");
            sb.AppendLine("			fa=fa+1;");
            sb.AppendLine("		if (y==0 && classifier[i]==1)");
            sb.AppendLine("			miss=miss+1;");
            sb.AppendLine("		if (y==0 && classifier[i]==0)");
            sb.AppendLine("			tn=tn+1;");
            sb.AppendLine("	}");
            sb.AppendLine("	s = sprintf(\"hits: %d\nfalse alarms: %d\nmisses: %d\ncorrect rejections: %d\n\", tp, fa, miss, tn);");
            sb.AppendLine("	cat(s);");
            sb.AppendLine("}");
            sb.AppendLine("");
            sb.AppendLine("classify <- function(cueValues, fftree, obj)");
            sb.AppendLine("{");
            sb.AppendLine("	n=length(fftree)");
            sb.AppendLine("	y=0;");
            sb.AppendLine("	for (i in 1:n)");
            sb.AppendLine("	{");
            sb.AppendLine("		if ((fftree[2,i]==1 && cueValues[i] >= fftree[1,i])||(fftree[2,i]==0 && cueValues[i]<fftree[1,i]))");
            sb.AppendLine("		{");
            sb.AppendLine("			y=1;");
            sb.AppendLine("         cat(sprintf(\"object: %d steps: %d\n\", obj, i))");
            sb.AppendLine("			break;");
            sb.AppendLine("		}");
            sb.AppendLine("	}");
            sb.AppendLine("	return(y);");
            sb.AppendLine("}");
            #endregion
            return sb.ToString();
        }
    }
}
